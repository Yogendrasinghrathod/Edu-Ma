const Razorpay = require("razorpay");
const Course = require("../models/CourseSchema");
const PurchaseCourse = require("../models/PurchaseCourse.model");
require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/UserSchema");
const Lecture = require("../models/lectureSchema");

const config = require("../config/config");

// Razorpay instance will be created inside the function to ensure config is loaded
let razorpay;
const getRazorpayInstance = () => {
  if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
    console.error("❌ Razorpay API keys are missing in config");
    return null;
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.coursePrice || course.coursePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price. Payment cannot be initiated.",
      });
    }

    const amountInPaise = Math.round(course.coursePrice * 100);

    const instance = getRazorpayInstance();
    if (!instance) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay is not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on Render.",
      });
    }

    console.log(
      `[Checkout] Initiating order for course: ${courseId}, user: ${userId}, price: ${course.coursePrice}`,
    );

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId,
        userId,
      },
    };

    let order;
    try {
      order = await instance.orders.create(orderOptions);
    } catch (orderError) {
      console.error("❌ Razorpay order creation failed:", orderError);
      return res.status(orderError.statusCode || 500).json({
        success: false,
        message: "Failed to create Razorpay order",
        error:
          orderError.error?.description ||
          orderError.message ||
          "Unknown Razorpay error",
        code: orderError.error?.code,
      });
    }

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
      key: config.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Internal Server Error in createCheckoutSession:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// const crypto = require("crypto");
// const mongoose = require("mongoose");

exports.razorpayWebhook = async (req, res) => {
  const secret = config.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];

  if (!secret) {
    console.error("❌ Webhook secret missing");
    return res.status(500).send("Server config error");
  }

  if (!receivedSignature) {
    return res.status(400).json({ message: "Missing signature header" });
  }

  // Signature verification MUST use the exact raw body received from Razorpay
  const body = req.rawBody ? req.rawBody : JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    console.error("❌ Webhook signature mismatch!");
    console.error("Received:", receivedSignature);
    console.error("Expected:", expectedSignature);
    return res.status(400).json({ message: "Invalid signature" });
  }

  console.log("✅ Webhook signature verified successfully");

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
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
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
