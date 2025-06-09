// import Stripe from "stripe";
// import Course from "../models/CourseSchema";
// import PurchaseCourse from "../models/PurchaseCourse.model";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const userId = req.id;
//     const [courseId] = req.body;
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


// export const stripeWebhook = async (req, res) => {
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


// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import Course from "../models/CourseSchema";
// import PurchaseCourse from "../models/PurchaseCourse.model";
// import Lecture from "../models/LectureSchema";
// import User from "../models/UserSchema";

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_ID_KEY,
//   key_secret: process.env.RAZORPAY_SECRET_KEY
// });

// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const userId = req.id;
//     const [courseId] = req.body;
    
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }

//     // Create a new course purchase record
//     const newPurchase = await PurchaseCourse({
//       courseId,
//       userId,
//       amount: course.coursePrice,
//       status: "pending",
//     });

//     // Create Razorpay order
//     const amount = course.coursePrice * 100; // Razorpay expects amount in paise
//     const options = {
//       amount: amount,
//       currency: 'INR',
//       receipt: newPurchase._id.toString(),
//       notes: {
//         courseId: courseId,
//         userId: userId
//       },
//       payment_capture: 1 // Auto-capture payment
//     };

//     const order = await razorpayInstance.orders.create(options);
    
//     if (!order.id) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Error while creating order" 
//       });
//     }

//     // Save the purchase record with Razorpay order ID
//     newPurchase.paymentId = order.id;
//     await newPurchase.save();

//     return res.status(200).json({
//       success: true,
//       order_id: order.id,
//       amount: amount,
//       currency: "INR",
//       key_id: process.env.RAZORPAY_ID_KEY,
//       course_name: course.courseTitle,
//       description: course.courseDescription,
//       image: course.courseThumbnail,
//       prefill: {
//         name: req.user?.name || "Customer",
//         email: req.user?.email || "customer@example.com",
//         contact: req.user?.phone || "9999999999"
//       },
//       notes: {
//         courseId: courseId,
//         userId: userId
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
//     // Create expected signature
//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest('hex');

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // Update purchase record
//     const purchase = await PurchaseCourse.findOne({ paymentId: razorpay_order_id }).populate('courseId');
//     if (!purchase) {
//       return res.status(404).json({ success: false, message: "Purchase not found" });
//     }

//     purchase.status = "completed";
//     purchase.paymentDetails = req.body;
//     await purchase.save();

//     // Make all lectures visible
//     if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//       await Lecture.updateMany(
//         { _id: { $in: purchase.courseId.lectures } },
//         { $set: { isPreviewFree: true } }
//       );
//     }

//     // Update user's enrolledCourses
//     await User.findByIdAndUpdate(
//       purchase.userId,
//       { $addToSet: { enrolledCourses: purchase.courseId._id } },
//       { new: true }
//     );

//     // Update course's enrolledStudents
//     await Course.findByIdAndUpdate(
//       purchase.courseId._id,
//       { $addToSet: { enrolledStudents: purchase.userId } },
//       { new: true }
//     );

//     return res.status(200).json({ 
//       success: true, 
//       message: "Payment verified successfully",
//       courseId: purchase.courseId._id
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Internal server error" 
//     });
//   }
// };

// export const razorpayWebhook = async (req, res) => {
//   try {
//     const body = req.body;
//     const razorpaySignature = req.headers['x-razorpay-signature'];
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     // Verify the webhook signature
//     const generatedSignature = crypto
//       .createHmac('sha256', webhookSecret)
//       .update(JSON.stringify(body))
//       .digest('hex');

//     if (generatedSignature !== razorpaySignature) {
//       console.error("Webhook signature verification failed");
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Handle different Razorpay webhook events
//     switch (body.event) {
//       case 'payment.captured':
//         await handleSuccessfulPayment(body.payload.payment.entity);
//         break;
      
//       case 'payment.failed':
//         await handleFailedPayment(body.payload.payment.entity);
//         break;
      
//       default:
//         console.log(`Unhandled event type: ${body.event}`);
//     }

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// async function handleSuccessfulPayment(payment) {
//   console.log("Payment successful:", payment.id);
  
//   try {
//     // Find purchase by order_id (which we stored as paymentId)
//     const purchase = await PurchaseCourse.findOne({
//       paymentId: payment.order_id
//     }).populate({ path: "courseId" });

//     if (!purchase) {
//       console.error("Purchase not found for order:", payment.order_id);
//       return;
//     }

//     // Update purchase details
//     purchase.amount = payment.amount / 100; // Convert from paise to rupees
//     purchase.status = "completed";
//     purchase.paymentDetails = payment;

//     // Make all lectures visible
//     if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//       await Lecture.updateMany(
//         { _id: { $in: purchase.courseId.lectures } },
//         { $set: { isPreviewFree: true } }
//       );
//     }

//     await purchase.save();

//     // Update user's enrolledCourses
//     await User.findByIdAndUpdate(
//       purchase.userId,
//       { $addToSet: { enrolledCourses: purchase.courseId._id } },
//       { new: true }
//     );

//     // Update course's enrolledStudents
//     await Course.findByIdAndUpdate(
//       purchase.courseId._id,
//       { $addToSet: { enrolledStudents: purchase.userId } },
//       { new: true }
//     );

//     console.log(`Successfully processed payment for order ${payment.order_id}`);
//   } catch (error) {
//     console.error("Error handling successful payment:", error);
//   }
// }

// async function handleFailedPayment(payment) {
//   console.log("Payment failed:", payment.id);
  
//   try {
//     const purchase = await PurchaseCourse.findOne({
//       paymentId: payment.order_id
//     });

//     if (purchase) {
//       purchase.status = "failed";
//       purchase.paymentDetails = payment;
//       await purchase.save();
//       console.log(`Marked order ${payment.order_id} as failed`);
//     }
//   } catch (error) {
//     console.error("Error handling failed payment:", error);
//   }
// }