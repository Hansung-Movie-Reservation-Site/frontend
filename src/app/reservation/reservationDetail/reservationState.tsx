"use client";
import { Disclosure } from "@headlessui/react";
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
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="size-8"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {steps.map((item, i) => (
                  <a
                    key={item}
                    aria-current={activeStep === i ? "page" : undefined}
                    className={classNames(
                      activeStep === i
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    onClick={() => setActiveStep(i)} // 클릭 시 해당 step 활성화
                  >
                    {item}
                  </a>
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
