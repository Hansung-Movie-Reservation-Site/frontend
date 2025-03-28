"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/common/Button"
import { Loader2 } from "lucide-react"

interface Theater {
  id: string
  name: string
  location: string
}

interface SelectedTheaterProps {
  theaters: Theater[]
  selectedTheater: Theater | null
  onSelectTheater: (theater: Theater) => void
  availableDates: string[]
  selectedDate: string
  onSelectDate: (date: string) => void
  availableTimes: string[]
  selectedTime: string
  onSelectTime: (time: string) => void
  onNextStep: () => void
  onPrevStep: () => void
  loading: boolean
}

export default function SelectedTheater({
  theaters,
  selectedTheater,
  onSelectTheater,
  availableDates,
  selectedDate,
  onSelectDate,
  availableTimes,
  selectedTime,
  onSelectTime,
  onNextStep,
  onPrevStep,
  loading,
}: SelectedTheaterProps) {
  const [regions, setRegions] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [theatersByRegion, setTheatersByRegion] = useState<Record<string, Theater[]>>({})
  const [error, setError] = useState("")

  // Group theaters by region
  useEffect(() => {
    if (theaters && theaters.length > 0) {
      // Extract region from theater name (assuming format like "서울 강남점")
      const theaterRegions = theaters.map((theater) => {
        const parts = theater.name.split(" ")
        return parts[0] // "서울", "경기", etc.
      })

      // Get unique regions
      const uniqueRegions = [...new Set(theaterRegions)]
      setRegions(uniqueRegions)

      // Set default selected region
      if (uniqueRegions.length > 0 && !selectedRegion) {
        setSelectedRegion(uniqueRegions[0])
      }

      // Group theaters by region
      const grouped: Record<string, Theater[]> = {}
      uniqueRegions.forEach((region) => {
        grouped[region] = theaters.filter((theater) => theater.name.startsWith(region))
      })
      setTheatersByRegion(grouped)
    }
  }, [theaters, selectedRegion])

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region)
  }

  const handleSelectTheater = (theater: Theater) => {
    onSelectTheater(theater)
    setError("")
  }

  const handleSelectDate = (date: string) => {
    onSelectDate(date)
    setError("")
  }

  const handleSelectTime = (time: string) => {
    onSelectTime(time)
    setError("")
  }

  const handleNextStep = () => {
    if (!selectedTheater) {
      setError("극장을 선택해주세요.")
      return
    }

    if (!selectedDate) {
      setError("날짜를 선택해주세요.")
      return
    }

    if (!selectedTime) {
      setError("시간을 선택해주세요.")
      return
    }

    setError("")
    onNextStep()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">극장 정보를 불러오는 중입니다...</span>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">극장 및 일시 선택</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Theater selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">극장</h3>

          <div className="flex mb-4 border-b border-gray-200">
            {regions.map((region) => (
              <button
                key={region}
                className={`
                  py-2 px-4 text-sm font-medium
                  ${selectedRegion === region ? "text-primary border-b-2 border-primary" : "text-gray-500"}
                `}
                onClick={() => handleSelectRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="h-64 overflow-y-auto border border-gray-200 rounded-md">
            {theatersByRegion[selectedRegion]?.map((theater) => (
              <button
                key={theater.id}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${selectedTheater?.id === theater.id ? "bg-primary/10 text-primary" : "hover:bg-gray-50"}
                `}
                onClick={() => handleSelectTheater(theater)}
              >
                {theater.name}
              </button>
            ))}

            {(!theatersByRegion[selectedRegion] || theatersByRegion[selectedRegion].length === 0) && (
              <div className="p-4 text-center text-gray-500 text-sm">해당 지역에 극장이 없습니다.</div>
            )}
          </div>
        </div>

        {/* Date selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">날짜</h3>

          <div className="h-64 overflow-y-auto border border-gray-200 rounded-md">
            {availableDates.map((date) => (
              <button
                key={date}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${selectedDate === date ? "bg-primary/10 text-primary" : "hover:bg-gray-50"}
                `}
                onClick={() => handleSelectDate(date)}
                disabled={!selectedTheater}
              >
                {date}
              </button>
            ))}

            {(!availableDates || availableDates.length === 0) && (
              <div className="p-4 text-center text-gray-500 text-sm">
                {selectedTheater ? "상영 가능한 날짜가 없습니다." : "극장을 먼저 선택해주세요."}
              </div>
            )}
          </div>
        </div>

        {/* Time selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">시간</h3>

          <div className="h-64 overflow-y-auto border border-gray-200 rounded-md">
            {availableTimes.map((time) => (
              <button
                key={time}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${selectedTime === time ? "bg-primary/10 text-primary" : "hover:bg-gray-50"}
                `}
                onClick={() => handleSelectTime(time)}
                disabled={!selectedDate}
              >
                {time}
              </button>
            ))}

            {(!availableTimes || availableTimes.length === 0) && (
              <div className="p-4 text-center text-gray-500 text-sm">
                {selectedDate ? "상영 가능한 시간이 없습니다." : "날짜를 먼저 선택해주세요."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevStep} variant="outline">
          이전
        </Button>
        <Button onClick={handleNextStep} disabled={!selectedTheater || !selectedDate || !selectedTime}>
          다음
        </Button>
      </div>
    </div>
  )
}

