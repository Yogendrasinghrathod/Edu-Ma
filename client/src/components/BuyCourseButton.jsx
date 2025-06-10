import React from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };
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
