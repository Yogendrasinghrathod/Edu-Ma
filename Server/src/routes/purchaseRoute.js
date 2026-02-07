const express = require("express");
const { auth } = require("../middlewares/middlewares");
const {
  createCheckoutSession,
  razorpayWebhook,
  stripeWebhook,
  verifyPayment,
  getPaymentStatus,
  checkEnrollmentStatus,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourses,
} = require("../controllers/coursePurchaseController");

const router = express.Router();

router.post("/checkout/create-checkout-session", auth, createCheckoutSession);
// router.post("/webhook",express.raw({type:"application/json"}),stripeWebhook)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook,
);
router.post("/verify-payment", auth, verifyPayment);
router.get("/payment-status/:orderId", auth, getPaymentStatus);
router.get("/enrollment-status/:courseId", auth, checkEnrollmentStatus);
router.get(
  "/course/:courseId/detail-with-status",
  auth,
  getCourseDetailsWithPurchaseStatus,
);
router.get("/purchased-courses", auth, getAllPurchasedCourses);

module.exports = router;
