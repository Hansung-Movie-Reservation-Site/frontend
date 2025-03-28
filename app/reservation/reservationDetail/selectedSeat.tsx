"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/common/Button"
import { Loader2 } from "lucide-react"

interface Seat {
  id: string
  row: string
  number: number
  booked: boolean
  selected?: boolean
}

interface SelectedSeatProps {
  availableSeats: Seat[]
  selectedSeats: Seat[]
  onToggleSeat: (seat: Seat) => void
  onNextStep: () => void
  onPrevStep: () => void
  loading: boolean
}

export default function SelectedSeat({
  availableSeats,
  selectedSeats,
  onToggleSeat,
  onNextStep,
  onPrevStep,
  loading,
}: SelectedSeatProps) {
  const [rows, setRows] = useState<string[]>([])
  const [seatsByRow, setSeatsByRow] = useState<Record<string, Seat[]>>({})
  const [error, setError] = useState("")

  // Organize seats by row
  useEffect(() => {
    if (availableSeats && availableSeats.length > 0) {
      const uniqueRows = [...new Set(availableSeats.map((seat) => seat.row))].sort()
      setRows(uniqueRows)

      const groupedSeats: Record<string, Seat[]> = {}
      uniqueRows.forEach((row) => {
        groupedSeats[row] = availableSeats.filter((seat) => seat.row === row).sort((a, b) => a.number - b.number)
      })
      setSeatsByRow(groupedSeats)
    }
  }, [availableSeats])

  const handleSeatClick = (seat: Seat) => {
    if (seat.booked) return

    // Check if already selected
    const isSelected = selectedSeats.some((s) => s.id === seat.id)

    // If not selected and already have 8 seats, show error
    if (!isSelected && selectedSeats.length >= 8) {
      setError("최대 8개의 좌석만 선택할 수 있습니다.")
      return
    }

    setError("")
    onToggleSeat(seat)
  }

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some((seat) => seat.id === seatId)
  }

  const handleNextStep = () => {
    if (selectedSeats.length === 0) {
      setError("좌석을 선택해주세요.")
      return
    }

    setError("")
    onNextStep()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">좌석 정보를 불러오는 중입니다...</span>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">좌석 선택</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-8">
        <div className="w-full bg-gray-200 h-12 flex items-center justify-center mb-8 rounded">스크린</div>

        <div className="flex flex-col items-center space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center w-full">
              <div className="w-8 text-center font-medium">{row}</div>
              <div className="flex flex-1 justify-center gap-2 flex-wrap">
                {seatsByRow[row]?.map((seat) => (
                  <button
                    key={seat.id}
                    className={`w-8 h-8 text-xs rounded-md flex items-center justify-center transition-colors ${
                      seat.booked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isSeatSelected(seat.id)
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.booked}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 rounded-sm mr-2"></div>
            <span className="text-sm">선택 가능</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
            <span className="text-sm">선택됨</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div>
            <span className="text-sm">예매됨</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={onPrevStep} variant="outline">
          이전
        </Button>
        <Button onClick={handleNextStep} disabled={selectedSeats.length === 0}>
          다음 ({selectedSeats.length}석 선택)
        </Button>
      </div>
    </div>
  )
}

