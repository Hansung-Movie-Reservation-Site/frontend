"use client";
import { Disclosure } from "@headlessui/react";
import MemoTypingText from "../../Common/Animation/typingAni";
import { memo, useCallback } from "react";
// { activeStep, setActiveStep }
interface ReservationStateProps {
  activeStep: number;
  setMemoActiveStep: (id: number) => void;
}

const ReservationNav = ({ activeStep, setMemoActiveStep }: ReservationStateProps) => {
  const steps = ["Movie", "Cinema", "Seats", "Payment"];

  function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  const back = (i: number) => {
    setMemoActiveStep(i);
  };
  const showSteps = useCallback(() => {
    return steps.map((item, i) => (
      <div key={item} className="relative flex">
        <span
          key={item}
          aria-current={activeStep === i ? "page" : undefined}
          className={classNames(
            activeStep === i
              ? "drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] text-gray-900 scale-110 transition-all"
              : "rounded-md text-gray-700 bg-white-500 hover:bg-gray-300",
            "px-4 py-3 font-medium m-1",
            "w-[100px] min-w-[100px] flex justify-center items-center"
          )}
          onClick={() => back(i)}
        >
          {/* // 클릭 시 해당 step 활성화 */}
          <MemoTypingText text={item} className=""></MemoTypingText>
        </span>
      </div>
    ));
  }, [activeStep]);

  return (
    <Disclosure as="nav" className="bg-white drop-shadow-[0_-6px_10px_rgba(0,0,0,0.1)] py-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div
            className="flex items-center"
            style={{ justifyContent: "space-between", margin: "auto" }}
          >
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-10">{showSteps()}</div>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};
const MemoNav = memo(ReservationNav);
MemoNav.displayName = "ReservationNav";
export default MemoNav;
