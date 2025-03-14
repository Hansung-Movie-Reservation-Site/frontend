import { motion } from "framer-motion";
export const BufferingAni = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        className="flex justify-center items-center h-40"
      >
        <div
          className={`w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}
        ></div>
      </motion.div>
    </div>
  );
};
