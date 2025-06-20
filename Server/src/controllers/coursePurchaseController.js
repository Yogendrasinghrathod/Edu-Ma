// const Stripe = require("stripe");
// const Course = require("../models/CourseSchema");
// const PurchaseCourse = require("../models/PurchaseCourse.model");

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// exports.createCheckoutSession = async (req, res) => {
//   try {
//     console.log("Incoming data:", req.body);
//     const userId = req.id;
//     const { courseId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }

//     //create a new course purchase record
//     const newPurchase = await PurchaseCourse({
//       courseId,
//       userId,
//       amount: course.coursePrice,
//       status: "pending",
//     });

//     //create a stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: course.courseTitle,
//               images: [course.courseThumbnail],
//             },
//             unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
//       cancel_url: `http://localhost:5173/course-detail/${courseId}`,
//       metadata: {
//         courseId: courseId,
//         userId: userId,
//       },
//       shipping_address_collection: {
//         allowed_countries: ["IN"], // Optionally restrict allowed countries
//       },
//     });

//     if (!session.url) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Error while creating session" });
//     }

//     // Save the purchase record
//     newPurchase.paymentId = session.id;
//     await newPurchase.save();

//     return res.status(200).json({
//       success: true,
//       url: session.url, // Return the Stripe checkout URL
//     });

//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.stripeWebhook = async (req, res) => {
//   let event;

//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   // Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     console.log("check session complete is called");

//     try {
//       const session = event.data.object;

//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }

//       if (session.amount_total) {
//         purchase.amount = session.amount_total / 100;
//       }
//       purchase.status = "completed";

//       // Make all lectures visible by setting `isPreviewFree` to true
//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } }
//         );
//       }

//       await purchase.save();

//       // Update user's enrolledCourses
//       await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
//         { new: true }
//       );

//       // Update course to add user ID to enrolledStudents
//       await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
//         { new: true }
//       );
//     } catch (error) {
//       console.error("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };

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
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];

  if (!secret) {
    console.error("Webhook secret missing");
    return res.status(500).send("Server config error");
  }

  if (!receivedSignature) {
    console.error("Missing x-razorpay-signature header");
    return res.status(400).json({ message: "Missing signature header" });
  }

  let rawBody = req.body;
  if (typeof rawBody !== 'string' && !Buffer.isBuffer(rawBody)) {
    // If it's an object, re-stringify it (shouldn't happen if middleware is correct)
    rawBody = Buffer.from(JSON.stringify(rawBody));
  }
  const expectedSignature = require("crypto")
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    console.log("❌ Signature mismatch:", receivedSignature, expectedSignature);
    return res.status(400).json({ message: "Invalid signature" });
  }

  let event;
  if (Buffer.isBuffer(req.body)) {
    event = JSON.parse(req.body.toString());
  } else if (typeof req.body === 'string') {
    event = JSON.parse(req.body);
  } else if (typeof req.body === 'object') {
    event = req.body; // Already parsed
  } else {
    throw new Error('Unknown body type');
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    try {
      console.log("✅ Payment captured:", payment);

      const purchase = await PurchaseCourse.findOne({
        paymentId: payment.order_id,
      }).populate("courseId");

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      purchase.status = "completed";
      purchase.amount = payment.amount / 100;

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        {
          $addToSet: {
            enrolledStudents: new mongoose.Types.ObjectId(purchase.userId),
          },
        },
        { new: true }
      );

      res.status(200).json({ message: "Payment verified and course unlocked" });
    } catch (err) {
      console.error("Webhook handler error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(200).json({ message: "Unhandled event type" });
  }

  console.log("Headers received:", req.headers);
};
