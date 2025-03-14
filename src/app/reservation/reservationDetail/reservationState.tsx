import { motion } from "framer-motion";
import { ProgressBarAni } from "@/app/Common/Animation/motionAni";

export const ReservationState = ({ activeStep }: { activeStep: number }) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="z-2 fixed bottom-0 left-0 w-4/5 bg-white shadow-lg p-4 rounded-t-2xl"
    >
      <div className="fixed bottom-0 left-1/10 w-4/5 z-20 p-4 bg-white border-t border-gray-200 shadow-sm md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <ProgressBarAni name="예매현황" width={activeStep * 25} className=""></ProgressBarAni>
        </span>
        <p className="hover:underline me-4 md:me-6">더보기</p>
      </div>
    </motion.div>
  );
};
