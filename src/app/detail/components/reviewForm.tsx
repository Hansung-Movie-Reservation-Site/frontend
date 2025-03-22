"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewFormProps {
  userRating: number;
  reviewContent: string;
  setUserRating: (rating: number) => void;
  setReviewContent: (content: string) => void;
  handleSubmitReview: (hasSpoiler: boolean) => void;
  hasUserReview: boolean; // 사용자가 이미 리뷰를 작성했는지 여부
}

export default function ReviewForm({
  userRating,
  reviewContent,
  setUserRating,
  setReviewContent,
  handleSubmitReview,
  hasUserReview,
}: ReviewFormProps) {
  const [hasSpoiler, setHasSpoiler] = useState(false);

  // 사용자가 이미 리뷰를 작성한 경우 메시지 표시
  if (hasUserReview) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">리뷰 작성하기</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-md">
            <p>이미 이 영화에 대한 리뷰를 작성하셨습니다. 추가 리뷰는 작성할 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">리뷰 작성하기</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="mb-4">
          <p className="mb-2 font-medium">평점</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                title="1"
                key={rating}
                className="focus:outline-none"
                onClick={() => setUserRating(rating)}
              >
                <Star
                  className={`w-6 h-6 ${
                    rating <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {userRating > 0 && <p className="text-sm mt-1">선택한 평점: {userRating}/5</p>}
        </div>
        <div className="mb-4">
          <p className="mb-2 font-medium">리뷰 내용</p>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="영화에 대한 생각을 자유롭게 작성해주세요."
            rows={5}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="spoiler-checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={hasSpoiler}
            onChange={(e) => setHasSpoiler(e.target.checked)}
          />
          <label htmlFor="spoiler-checkbox" className="ml-2 text-sm text-gray-700">
            이 리뷰에는 스포일러가 포함되어 있습니다
          </label>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={() => handleSubmitReview(hasSpoiler)}
        >
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
}
