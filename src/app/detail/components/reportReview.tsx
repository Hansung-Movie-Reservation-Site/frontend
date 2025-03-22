"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface ReportReason {
  id: string;
  label: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (reviewId: number) => void;
  reviewId: number | null;
}

export default function ReportReview({
  isOpen,
  onClose,
  onReportSubmitted,
  reviewId,
}: ReportModalProps) {
  // 신고 이유 옵션
  const reportReasons: ReportReason[] = [
    { id: "inappropriate", label: "부적절한 내용" },
    { id: "spoiler", label: "스포일러 포함" },
    { id: "offensive", label: "공격적인 언어 사용" },
    { id: "spam", label: "스팸 또는 광고" },
    { id: "other", label: "기타 사유" },
  ];

  // 선택된 신고 이유
  const [selectedReason, setSelectedReason] = useState("");

  // 모달이 닫힐 때 선택된 이유 초기화
  const handleClose = () => {
    setSelectedReason("");
    onClose();
  };

  // 신고 제출
  const handleSubmit = () => {
    if (!selectedReason || !reviewId) return;

    // 부모 컴포넌트에 신고 완료 알림
    onReportSubmitted(reviewId);

    // 상태 초기화 및 모달 닫기
    setSelectedReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">리뷰 신고하기</h3>
            <p className="text-sm text-gray-500">이 리뷰를 신고하는 이유를 선택해주세요.</p>
          </div>
          <button title="1" className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 my-4">
          {reportReasons.map((reason) => (
            <label key={reason.id} className="flex items-center space-x-2 py-2 cursor-pointer">
              <input
                type="radio"
                name="reportReason"
                value={reason.id}
                checked={selectedReason === reason.id}
                onChange={() => setSelectedReason(reason.id)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>{reason.label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            onClick={handleClose}
          >
            취소
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              selectedReason
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-red-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!selectedReason}
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
