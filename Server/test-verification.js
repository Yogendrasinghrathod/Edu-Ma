const axios = require('axios');
const crypto = require('crypto');

// Test data - replace with actual values from your database
const testData = {
  orderId: "order_test123", // Replace with actual order ID from your database
  paymentId: "pay_test123", // Replace with actual payment ID
  signature: "test_signature" // This will be invalid, but we can see the error
};

// Function to test verification endpoint
async function testVerification() {
  try {
    console.log("🧪 Testing payment verification endpoint...");
    console.log("Test data:", testData);
    
    const response = await axios.post('https://edu-ma.onrender.com/api/v1/purchase/verify-payment', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'token=your_test_token_here' // You'll need to replace this with a valid token
      }
    });
    
    console.log("✅ Verification successful:", response.data);
  } catch (error) {
    console.error("❌ Verification failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
}

// Function to test payment status endpoint
async function testPaymentStatus() {
  try {
    console.log("🧪 Testing payment status endpoint...");
    
    const response = await axios.get(`https://edu-ma.onrender.com/api/v1/purchase/payment-status/${testData.orderId}`, {
      headers: {
        'Cookie': 'token=your_test_token_here' // You'll need to replace this with a valid token
      }
    });
    
    console.log("✅ Payment status:", response.data);
  } catch (error) {
    console.error("❌ Payment status check failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
  }
}

// Uncomment to run tests
// testVerification();
// testPaymentStatus();

console.log("Test script ready. Uncomment the function calls to run tests.");
console.log("Make sure to:");
console.log("1. Replace 'your_test_token_here' with a valid JWT token");
console.log("2. Replace orderId with an actual order ID from your database");
console.log("3. Start your server on port 5001"); 