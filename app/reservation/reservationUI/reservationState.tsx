"use client"

import { CheckCircle } from "lucide-react"

interface ReservationStateProps {
  currentStep: string
  selectedMovie: any
  selectedTheater: any
  selectedDate: string
  selectedTime: string
  selectedSeats: any[]
  totalPrice: number
}

export default function ReservationState({
  currentStep,
  selectedMovie,
  selectedTheater,
  selectedDate,
  selectedTime,
  selectedSeats,
  totalPrice,
}: ReservationStateProps) {
  const steps = [
    { id: "movie", label: "영화 선택" },
    { id: "theater", label: "극장/일시 선택" },
    { id: "seat", label: "좌석 선택" },
    { id: "payment", label: "결제" },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-lg font-medium mb-4">예매 진행 상태</h3>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted =
            (step.id === "movie" && selectedMovie) ||
            (step.id === "theater" && selectedTheater && selectedDate && selectedTime) ||
            (step.id === "seat" && selectedSeats.length > 0) ||
            (step.id === "payment" && false) // Payment is never completed until booking is done

          return (
            <div key={step.id} className={`flex items-center p-2 rounded-md ${isActive ? "bg-primary/10" : ""}`}>
              <div
                className={`
                w-6 h-6 rounded-full flex items-center justify-center mr-3
                ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
              </div>
              <span className={`text-sm ${isActive ? "font-medium" : ""}`}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

