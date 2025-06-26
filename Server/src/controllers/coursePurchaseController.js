
const Razorpay = require("razorpay");
const Course = require("../models/CourseSchema");
const PurchaseCourse = require("../models/PurchaseCourse.model");
require("dotenv").config();

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
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const crypto = require("crypto");
const User = require("../models/UserSchema");
const Lecture = require("../models/lectureSchema");

// const crypto = require("crypto");
const mongoose = require("mongoose");

exports.razorpayWebhook = async (req, res) => {
  console.log("🔔 Webhook received");
  console.log("Headers:", req.headers);
  console.log("Body type:", typeof req.body);
  console.log("Body length:", req.body ? req.body.length : "undefined");

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];

  if (!secret) {
    console.error("❌ Webhook secret missing");
    return res.status(500).send("Server config error");
  }

  if (!receivedSignature) {
    console.error("❌ Missing x-razorpay-signature header");
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

  console.log("🔐 Signature verification:");
  console.log("Received:", receivedSignature);
  console.log("Expected:", expectedSignature);

  if (receivedSignature !== expectedSignature) {
    console.log("❌ Signature mismatch");
    return res.status(400).json({ message: "Invalid signature" });
  }

  console.log("✅ Signature verified successfully");

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

    console.log("📦 Parsed event:", event);
  } catch (error) {
    console.error("❌ Error parsing webhook body:", error);
    return res.status(400).json({ message: "Invalid webhook body" });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    try {
      console.log("✅ Payment captured:", payment);

      const purchase = await PurchaseCourse.findOne({
        paymentId: payment.order_id,
      }).populate("courseId");

      if (!purchase) {
        console.error("❌ Purchase not found for order_id:", payment.order_id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      console.log("✅ Found purchase:", purchase);

      purchase.status = "completed";
      purchase.amount = payment.amount / 100;

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();
      console.log("✅ Purchase status updated to completed");

      // Update user's enrolled courses
      console.log("👤 Updating user's enrolled courses");
      console.log("User ID:", purchase.userId);
      console.log("Course ID:", purchase.courseId._id);

      const updatedUser = await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );
      console.log("✅ User updated:", updatedUser.enrolledCourses);

      // Update course's enrolled students
      console.log("📚 Updating course's enrolled students");
      console.log("Course ID:", purchase.courseId._id);
      console.log("Course ID type:", typeof purchase.courseId._id);
      console.log("Student ID to add:", purchase.userId);
      console.log("Student ID type:", typeof purchase.userId);

      // Check current course state before update
      const courseBeforeUpdate = await Course.findById(purchase.courseId._id);
      console.log("📊 Course before update:", {
        _id: courseBeforeUpdate._id,
        enrolledStudents: courseBeforeUpdate.enrolledStudents,
        enrolledStudentsCount: courseBeforeUpdate.enrolledStudents
          ? courseBeforeUpdate.enrolledStudents.length
          : 0,
      });

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
          { new: true }
        );
      } catch (error) {
        console.log(
          "⚠️ First attempt failed, trying with string conversion..."
        );
        // If that fails, try converting to strings
        updatedCourse = await Course.findByIdAndUpdate(
          purchase.courseId._id.toString(),
          {
            $addToSet: {
              enrolledStudents: purchase.userId.toString(),
          },
        },
        { new: true }
      );
      }

      console.log("✅ Course after update:", {
        _id: updatedCourse._id,
        enrolledStudents: updatedCourse.enrolledStudents,
        enrolledStudentsCount: updatedCourse.enrolledStudents
          ? updatedCourse.enrolledStudents.length
          : 0,
      });

      console.log("✅ All updates completed successfully");
      res.status(200).json({ message: "Payment verified and course unlocked" });
    } catch (err) {
      console.error("❌ Webhook handler error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    console.log("ℹ️ Unhandled event type:", event.event);
    res.status(200).json({ message: "Unhandled event type" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    console.log("🔍 Payment verification request received");
    console.log("Request body:", req.body);
    console.log("User ID:", req.id);

    const { orderId, paymentId, signature } = req.body;
    const userId = req.id;

    if (!orderId || !paymentId || !signature) {
      console.log("❌ Missing parameters:", {
        orderId,
        paymentId,
        signature: signature ? "present" : "missing",
      });
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters",
      });
    }

    console.log("🔐 Verifying payment signature...");
    // Verify the payment signature
    const text = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(text)
      .digest("hex");

    console.log("Signature verification:", {
      received: signature,
      expected: expectedSignature,
      matches: signature === expectedSignature,
    });

    if (signature !== expectedSignature) {
      console.log("❌ Signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("✅ Signature verified successfully");

    // Find the purchase record
    console.log(
      "🔍 Looking for purchase with orderId:",
      orderId,
      "and userId:",
      userId
    );
    const purchase = await PurchaseCourse.findOne({
      paymentId: orderId,
      userId: userId,
    }).populate("courseId");

    if (!purchase) {
      console.log("❌ Purchase record not found");
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    console.log("✅ Found purchase record:", purchase);

    // Update purchase status
    console.log(
      "📝 Updating purchase status from",
      purchase.status,
      "to completed"
    );
    purchase.status = "completed";
    await purchase.save();
    console.log("✅ Purchase status updated successfully");

    // Make lectures accessible
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      console.log(
        "🔓 Making lectures accessible for course:",
        purchase.courseId._id
      );
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
      console.log("✅ Lectures updated successfully");
    }

    // Update user's enrolled courses
    console.log("👤 Updating user's enrolled courses");
    console.log("User ID:", purchase.userId);
    console.log("Course ID:", purchase.courseId._id);

    const updatedUser = await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );
    console.log("✅ User updated:", updatedUser.enrolledCourses);

    // Update course's enrolled students
    console.log("📚 Updating course's enrolled students");
    console.log("Course ID:", purchase.courseId._id);
    console.log("Course ID type:", typeof purchase.courseId._id);
    console.log("Student ID to add:", purchase.userId);
    console.log("Student ID type:", typeof purchase.userId);

    // Check current course state before update
    const courseBeforeUpdate = await Course.findById(purchase.courseId._id);
    console.log("📊 Course before update:", {
      _id: courseBeforeUpdate._id,
      enrolledStudents: courseBeforeUpdate.enrolledStudents,
      enrolledStudentsCount: courseBeforeUpdate.enrolledStudents
        ? courseBeforeUpdate.enrolledStudents.length
        : 0,
    });

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
        { new: true }
      );
    } catch (error) {
      console.log("⚠️ First attempt failed, trying with string conversion...");
      // If that fails, try converting to strings
      updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id.toString(),
        {
          $addToSet: {
            enrolledStudents: purchase.userId.toString(),
          },
        },
        { new: true }
      );
    }

    console.log("✅ Course after update:", {
      _id: updatedCourse._id,
      enrolledStudents: updatedCourse.enrolledStudents,
      enrolledStudentsCount: updatedCourse.enrolledStudents
        ? updatedCourse.enrolledStudents.length
        : 0,
    });

    console.log("✅ All updates completed successfully");

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      purchase: purchase,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
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
    console.error("Get payment status error:", error);
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

    console.log(
      "🔍 Checking enrollment status for course:",
      courseId,
      "and user:",
      userId
    );

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
      user.enrolledCourses && user.enrolledCourses.includes(courseId);
    const isStudentEnrolled =
      course.enrolledStudents && course.enrolledStudents.includes(userId);

    console.log("📊 Enrollment status:", {
      userEnrolledCourses: user.enrolledCourses,
      courseEnrolledStudents: course.enrolledStudents,
      isEnrolled,
      isStudentEnrolled,
    });

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
    console.error("❌ Check enrollment status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.testEnrollment = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    console.log("🧪 Testing enrollment with:", { courseId, userId });

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and User ID are required",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("📊 Before enrollment:");
    console.log("Course enrolled students:", course.enrolledStudents);
    console.log("User enrolled courses:", user.enrolledCourses);

    // Test enrollment
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          enrolledStudents: userId,
        },
      },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          enrolledCourses: courseId,
        },
      },
      { new: true }
    );

    console.log("📊 After enrollment:");
    console.log("Course enrolled students:", updatedCourse.enrolledStudents);
    console.log("User enrolled courses:", updatedUser.enrolledCourses);

    res.status(200).json({
      success: true,
      message: "Test enrollment completed",
      course: {
        _id: updatedCourse._id,
        enrolledStudents: updatedCourse.enrolledStudents,
        enrolledStudentsCount: updatedCourse.enrolledStudents
          ? updatedCourse.enrolledStudents.length
          : 0,
      },
      user: {
        _id: updatedUser._id,
        enrolledCourses: updatedUser.enrolledCourses,
        enrolledCoursesCount: updatedUser.enrolledCourses
          ? updatedUser.enrolledCourses.length
          : 0,
      },
    });
  } catch (error) {
    console.error("❌ Test enrollment error:", error);
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

    console.log("🔍 Getting course details for courseId:", courseId, "userId:", userId);

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

    console.log("✅ Course found:", course.courseTitle);
    console.log("✅ Purchase status:", purchased ? "Purchased" : "Not purchased");

    return res.status(200).json({
      success: true,
      course,
      purchased: purchased ? true : false,
    });
  } catch (error) {
    console.error("❌ Error in getCourseDetailsWithPurchaseStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllPurchasedCourses = async (req, res) => {
  try {
    const userId = req.id;
    
    console.log("🔍 Getting all purchased courses for userId:", userId);

    const purchasedCourses = await PurchaseCourse.find({ 
      userId: userId, 
      status: "completed" 
    })
      .populate("courseId")
      .populate({ path: "userId" });

    console.log("✅ Found", purchasedCourses.length, "purchased courses");

    return res.status(200).json({
      success: true,
      purchasedCourses: purchasedCourses || [],
    });
  } catch (error) {
    console.error("❌ Error in getAllPurchasedCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
