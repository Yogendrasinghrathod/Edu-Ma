const express = require('express');
const { auth } = require('../middlewares/middlewares');
const { createCheckoutSession, stripeWebhook } = require('../controllers/coursePurchaseController');


const router=express.Router();


router.post("/checkout/create-checkout-session",auth,createCheckoutSession)
router.post("/webhook",express.raw({type:"application/json"}),stripeWebhook)
router.get("/course/:courseId/detail-with-status")



module.exports = router;