const crypto = require('crypto');
const axios = require('axios');

// Test webhook payload
const testPayload = {
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test123",
        order_id: "order_test123", // This should match a real order ID from your database
        amount: 50000, // Amount in paise (500 INR)
        currency: "INR",
        status: "captured"
      }
    }
  }
};

// Your webhook secret (replace with your actual secret)
const webhookSecret = "your_webhook_secret_here";

// Generate signature
const payloadString = JSON.stringify(testPayload);
const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(payloadString)
  .digest("hex");

console.log("Test payload:", payloadString);
console.log("Generated signature:", signature);

// Send test webhook
async function testWebhook() {
  try {
    const response = await axios.post('https://edu-ma.onrender.com/api/v1/purchase/webhook', payloadString, {
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': signature
      }
    });
    
    console.log("Webhook response:", response.status, response.data);
  } catch (error) {
    console.error("Webhook test failed:", error.response?.data || error.message);
  }
}

// Uncomment the line below to run the test
// testWebhook(); 