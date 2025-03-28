"use client"

import { useState } from "react"
import { Button } from "@/src/components/common/Button"
import { CreditCard, Wallet, BanknoteIcon } from "lucide-react"

interface PaymentProps {
  totalPrice: number
  onSelectPaymentMethod: (method: string) => void
  onCompleteBooking: () => void
  onPrevStep: () => void
  loading: boolean
}

export default function Payment({
  totalPrice,
  onSelectPaymentMethod,
  onCompleteBooking,
  onPrevStep,
  loading,
}: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState("credit-card")
  const [error, setError] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method)
    onSelectPaymentMethod(method)
  }

  const handleCompleteBooking = () => {
    if (!agreeTerms) {
      setError("결제 진행을 위해 약관에 동의해주세요.")
      return
    }

    setError("")
    onCompleteBooking()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">결제</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">결제 수단 선택</h3>

        <div className="grid grid-cols-3 gap-4">
          <div
            className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              selectedMethod === "credit-card" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleMethodSelect("credit-card")}
          >
            <CreditCard className={`h-8 w-8 mb-2 ${selectedMethod === "credit-card" ? "text-primary" : ""}`} />
            <span className="text-sm font-medium">신용카드</span>
          </div>

          <div
            className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              selectedMethod === "bank-transfer" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleMethodSelect("bank-transfer")}
          >
            <BanknoteIcon className={`h-8 w-8 mb-2 ${selectedMethod === "bank-transfer" ? "text-primary" : ""}`} />
            <span className="text-sm font-medium">계좌이체</span>
          </div>

          <div
            className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              selectedMethod === "mobile" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleMethodSelect("mobile")}
          >
            <Wallet className={`h-8 w-8 mb-2 ${selectedMethod === "mobile" ? "text-primary" : ""}`} />
            <span className="text-sm font-medium">간편결제</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">결제 금액</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">티켓 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">할인 금액</span>
            <span>0원</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
            <span>최종 결제 금액</span>
            <span className="text-primary text-lg">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agree-terms"
            className="mt-1"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-600">
            주문 내용을 확인하였으며, 결제 진행에 동의합니다. (필수)
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevStep} variant="outline">
          이전
        </Button>
        <Button
          onClick={handleCompleteBooking}
          disabled={!selectedMethod || loading}
          loading={loading}
          loadingText="결제 처리 중..."
        >
          결제하기
        </Button>
      </div>
    </div>
  )
}

