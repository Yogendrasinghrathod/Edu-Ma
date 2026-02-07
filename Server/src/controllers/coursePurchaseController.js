const Razorpay = require("razorpay");
const Course = require("../models/CourseSchema");
const PurchaseCourse = require("../models/PurchaseCourse.model");
require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/UserSchema");
const Lecture = require("../models/lectureSchema");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const amountInPaise = course.coursePrice * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId,
        userId,
      },
    });

    const newPurchase = new PurchaseCourse({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.id,
    });

    await newPurchase.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.courseTitle,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// const crypto = require("crypto");
// const mongoose = require("mongoose");

exports.razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];

  if (!secret) {
    onsole.error("❌ Webhook secret missing");
    return res.status(500).send("Server config error");
  }

  if (!receivedSignature) {
    return res.status(400).json({ message: "Missing signature header" });
  }

  let rawBody = req.body;
  if (typeof rawBody !== "string" && !Buffer.isBuffer(rawBody)) {
    // If it's an object, re-stringify it (shouldn't happen if middleware is correct)
    rawBody = Buffer.from(JSON.stringify(rawBody));
  }

  const expectedSignature = require("crypto")
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  let event;
  try {
    if (Buffer.isBuffer(req.body)) {
      event = JSON.parse(req.body.toString());
    } else if (typeof req.body === "string") {
      event = JSON.parse(req.body);
    } else if (typeof req.body === "object") {
      event = req.body; // Already parsed
    } else {
      throw new Error("Unknown body type");
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid webhook body" });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    try {
      const purchase = await PurchaseCourse.findOne({
        paymentId: payment.order_id,
      }).populate("courseId");

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      purchase.status = "completed";
      purchase.amount = payment.amount / 100;

      // if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      //   await Lecture.updateMany(
      //     { _id: { $in: purchase.courseId.lectures } },
      //     { $set: { isPreviewFree: true } }
      //   );
      // }

      await purchase.save();
      // Update user's enrolled courses

      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true },
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true },
      );

      return res
        .status(200)
        .json({ message: "Payment verified and course unlocked" });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters",
      });
    }

    // Verify the payment signature
    const text = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(text)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find the purchase record

    const purchase = await PurchaseCourse.findOne({
      paymentId: orderId,
      userId: userId,
    }).populate("courseId");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    // Update purchase status

    purchase.status = "completed";
    await purchase.save();

    const updatedUser = await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true },
    );

    // Update course's enrolled students

    // Check current course state before update

    // Try multiple approaches to ensure enrollment works
    let updatedCourse;
    try {
      // First try with original IDs
      updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id,
        {
          $addToSet: {
            enrolledStudents: purchase.userId,
          },
        },
        { new: true },
      );
    } catch (error) {
      // If that fails, try converting to strings
      updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id.toString(),
        {
          $addToSet: {
            enrolledStudents: purchase.userId.toString(),
          },
        },
        { new: true },
      );
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      purchase: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
    });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.id;

    const purchase = await PurchaseCourse.findOne({
      paymentId: orderId,
      userId: userId,
    }).populate("courseId");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    res.status(200).json({
      success: true,
      purchase: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isEnrolled =
      (user.enrolledCourses && user.enrolledCourses.includes(courseId)) ||
      course.creator.toString() === userId;
    const isStudentEnrolled =
      (course.enrolledStudents && course.enrolledStudents.includes(userId)) ||
      course.creator.toString() === userId;

    res.status(200).json({
      success: true,
      enrollmentStatus: {
        isEnrolled,
        isStudentEnrolled,
        userEnrolledCourses: user.enrolledCourses,
        courseEnrolledStudents: course.enrolledStudents,
        totalEnrolledStudents: course.enrolledStudents
          ? course.enrolledStudents.length
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await PurchaseCourse.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found!",
      });
    }

    // Check if the current user is the creator
    const isCreator =
      course.creator && course.creator._id.toString() === userId;

    return res.status(200).json({
      success: true,
      course,
      purchased: purchased || isCreator ? true : false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllPurchasedCourses = async (req, res) => {
  try {
    const instructorId = req.id; // The logged-in instructor's user ID

    // Find all courses created by this instructor
    const instructorCourses = await Course.find({
      creator: instructorId,
    }).select("_id");

    if (!instructorCourses || instructorCourses.length === 0) {
      return res.status(200).json({
        success: true,
        purchasedCourses: [],
      });
    }

    const courseIds = instructorCourses.map((course) => course._id);

    // Find all purchases for these courses
    const purchasedCourses = await PurchaseCourse.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      success: true,
      purchasedCourses: purchasedCourses || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
