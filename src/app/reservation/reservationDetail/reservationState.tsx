"use client";
import { Disclosure } from "@headlessui/react";
import { TypingText } from "@/app/Common/Animation/TypingAni";
// { activeStep, setActiveStep }
interface ReservationStateProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const ReservationState = ({ activeStep, setActiveStep }: ReservationStateProps) => {
  const steps = ["Movie", "Cinema", "Seats", "Payment"];

  function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-white drop-shadow-[0_-6px_10px_rgba(0,0,0,0.1)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* <div className="shrink-0">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="size-8"
            />
          </div> */}
          <div
            className="flex items-center"
            style={{ justifyContent: "space-between", margin: "auto" }}
          >
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-10">
                {steps.map((item, i) => (
                  <div key={item} className="relative flex">
                    <span
                      key={item}
                      aria-current={activeStep === i ? "page" : undefined}
                      className={classNames(
                        activeStep === i
                          ? "bg-gray-900 text-white m-1 px-4 py-3"
                          : "text-gray-700 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-4 py-3 font-medium m-1",
                        "w-[100px] min-w-[100px] block flex justify-center items-center"
                      )}
                      onClick={() => setActiveStep(i)}
                    >
                      {/* // 클릭 시 해당 step 활성화 */}
                      <TypingText text={item}></TypingText>
                    </span>
                    <span
                      className={classNames(
                        activeStep === i ? "relative flex size-3 translate-x-[-10px]" : "invisible"
                      )}
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                    </span>
                  </div>
                  // <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default ReservationState;
