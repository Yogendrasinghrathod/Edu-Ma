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

  const signature = req.headers["x-razorpay-signature"];
  const body = req.body.toString(); // use raw body string

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("Signature mismatch:", signature, expectedSignature);
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = JSON.parse(body); // manually parse raw body

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    try {
      console.log("Payment captured event:", payment);

      const purchase = await PurchaseCourse.findOne({
        paymentId: payment.order_id, // Or payment.id if that's what you stored
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

      console.log("Updating course ID:", purchase.courseId._id);
console.log("Adding user ID:", purchase.userId);


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
      console.error("Webhook error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(200).json({ message: "Unhandled event type" });
  }
};


