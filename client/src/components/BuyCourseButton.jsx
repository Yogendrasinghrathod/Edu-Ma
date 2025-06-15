import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data,isLoading ,isError,isSuccess}] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  // useEffect(()=>{
  //   if(isSuccess){
  //     if(data?.url){
  //       window.location.href=data.url;    //redirect to stripe checkout url
  //     }else{
  //       toast.error("failed to create checkout")
  //     }
  //   }
  //   if(isError){
  //     toast.error("Invalid ")
  //   }
  // },[data,isSuccess,isError])



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
          handler: function (response) {
            toast.success("Payment successful ✅");
            // Optionally: call backend to verify payment here
          },
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
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 animate-spin " />
          Please wait
        </>
      ) : (
        <>Purchase Course</>
      )}
    </Button>
  );
};

export default BuyCourseButton;
