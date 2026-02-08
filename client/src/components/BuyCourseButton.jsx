import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
import {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadRazorpay } from "@/utils/razorpay"; // Import the utility
import PropTypes from "prop-types";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data, isLoading, isError, isSuccess }] =
    useCreateCheckoutSessionMutation();

  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();
   const navigate = useNavigate();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  const handlePaymentSuccess = useCallback(
    async (response) => {
      try {
        const verificationData = {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };
        await verifyPayment(verificationData);
        toast.success("Payment successful ✅");
        // Redirect to course progress page
        navigate(`/course-progress/${courseId}`);
      } catch (_error) {
        toast.error(
          "Payment verification failed. Please contact support.",
          _error,
        );
      }
    },
    [verifyPayment, courseId, navigate],
  );

  useEffect(() => {
    const initiatePayment = async () => {
      if (isSuccess && data?.orderId) {
        const isLoaded = await loadRazorpay(); // Load Razorpay script dynamically
        if (!isLoaded) {
          toast.error(
            "Failed to load Razorpay SDK. Please check your connection.",
          );
          return;
        }

        if (window.Razorpay) {
          const options = {
            key: data.key,
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
          toast.error("Razorpay SDK not loaded correctly.");
        }
      } else if (isSuccess && !data?.orderId) {
        toast.error("Failed to create Razorpay order");
      }
    };

    if (isSuccess) {
      initiatePayment();
    }

    if (isError) {
      toast.error("Something went wrong during checkout");
    }
  }, [data, isSuccess, isError, handlePaymentSuccess]);

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

BuyCourseButton.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default BuyCourseButton;
