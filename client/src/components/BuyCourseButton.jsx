import  { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation, useVerifyPaymentMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = (courseId ) => {
  const [createCheckoutSession, { data,isLoading ,isError,isSuccess}] =
    useCreateCheckoutSessionMutation();
  
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // console.log("🎉 Payment successful response:", response);
      
     
      const verificationData = {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      };
      
      // console.log("📤 Sending verification data:", verificationData);
      
      const result = await verifyPayment(verificationData);
      console.log("Verification result:", result);
      
      toast.success("Payment successful ✅");
      // Optionally redirect or refresh the page
      window.location.reload();
    } catch (error) {
      console.error("❌ Payment verification failed:", error);
      console.error("Error details:", error.data || error.message);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  useEffect(() => {
  if (isSuccess) {
    if (data?.orderId) {
      if (window.Razorpay) {
        const options = {
          key:  data.key,
          amount: data.amount,
          currency: data.currency,
          name: data.courseTitle,
          order_id: data.orderId,
          handler: handlePaymentSuccess,
          theme: { color: "black" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay SDK not loaded. Please refresh and try again.");
      }
    } else {
      toast.error("Failed to create Razorpay order");
    }
  }

  if (isError) {
    toast.error("Something went wrong during checkout");
  }
}, [data, isSuccess, isError]);

  return (
    <Button
      disabled={isLoading || isVerifying}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading || isVerifying ? (
        <>
          <Loader2 className="mr-2 h-4 animate-spin " />
          {isVerifying ? "Verifying Payment..." : "Please wait"}
        </>
      ) : (
        <>Purchase Course</>
      )}
    </Button>
  );
};

export default BuyCourseButton;
