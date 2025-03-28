"use client"

import Image from "next/image"

interface BookingInfoProps {
  currentStep: string
  selectedMovie: any
  selectedTheater: any
  selectedDate: string
  selectedTime: string
  selectedSeats: any[]
  totalPrice: number
}

export default function BookingInfo({
  currentStep,
  selectedMovie,
  selectedTheater,
  selectedDate,
  selectedTime,
  selectedSeats,
  totalPrice,
}: BookingInfoProps) {
  if (!selectedMovie) {
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">예매 정보</h3>

      <div className="flex mb-4">
        <div className="w-1/3">
          {selectedMovie.posterImage ? (
            <Image
              src={selectedMovie.posterImage || "/placeholder.svg"}
              alt={selectedMovie.title}
              width={100}
              height={150}
              className="rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=150&width=100&text=${encodeURIComponent(selectedMovie.title)}`
              }}
            />
          ) : (
            <div className="w-[100px] h-[150px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div className="w-2/3 pl-4">
          <h4 className="font-medium text-lg mb-1">{selectedMovie.title}</h4>
          <p className="text-sm text-gray-600 mb-1">
            {selectedMovie.runtime}분 | {selectedMovie.genres || "장르 정보 없음"}
          </p>
          <p className="text-sm text-gray-600">{selectedMovie.director ? `감독: ${selectedMovie.director}` : ""}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-200 pt-4">
        {selectedTheater && (
          <div className="flex">
            <span className="w-20 text-sm text-gray-500">극장</span>
            <span className="text-sm font-medium">{selectedTheater.name}</span>
          </div>
        )}

        {selectedDate && selectedTime && (
          <div className="flex">
            <span className="w-20 text-sm text-gray-500">일시</span>
            <span className="text-sm font-medium">
              {selectedDate} {selectedTime}
            </span>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="flex">
            <span className="w-20 text-sm text-gray-500">좌석</span>
            <span className="text-sm font-medium">
              {selectedSeats.map((seat) => seat.id).join(", ")}
              <span className="text-gray-500 ml-1">({selectedSeats.length}석)</span>
            </span>
          </div>
        )}

        {totalPrice > 0 && (
          <div className="flex pt-2 border-t border-gray-200 mt-2">
            <span className="w-20 text-sm text-gray-500">금액</span>
            <span className="text-sm font-medium text-primary">{totalPrice.toLocaleString()}원</span>
          </div>
        )}
      </div>
    </div>
  )
}

