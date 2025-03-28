"use client"

interface ReservationNavProps {
  currentStep: string
}

export default function ReservationNav({ currentStep }: ReservationNavProps) {
  const steps = [
    { id: "movie", label: "01 영화 선택" },
    { id: "theater", label: "02 극장/일시 선택" },
    { id: "seat", label: "03 좌석 선택" },
    { id: "payment", label: "04 결제" },
  ]

  return (
    <div className="mb-6">
      <div className="flex border-b border-gray-200">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              py-3 px-4 text-center flex-1 font-medium text-sm
              ${currentStep === step.id ? "text-primary border-b-2 border-primary" : "text-gray-500"}
            `}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}

