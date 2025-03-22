"use client";

import { useState } from "react";
import { Star, ThumbsUp, Flag, Trash2, AlertTriangle } from "lucide-react";

export interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  likes: number;
  comment: string;
  isOwnReview?: boolean;
  hasSpoiler?: boolean;
}

// 초기 리뷰 데이터
const sampleReviews: Review[] = [
  {
    id: 1,
    name: "김지수",
    date: "2023-10-15",
    rating: 5,
    likes: 12,
    comment:
      "영화의 반전은 기택 가족이 지하실에 숨어 사는 문광과 그의 남편을 발견하는 장면이었습니다. 특히 충격적이었던 것은 박사장이 살해당하는 장면과 기우가 돌로 맞는 장면이었습니다. 마지막에 기택이 지하실에 숨어 사는 것으로 끝나는데, 이는 계급의 순환을 의미합니다.",
    isOwnReview: false,
    hasSpoiler: true,
  },
  {
    id: 2,
    name: "이민호",
    date: "2023-09-22",
    rating: 4,
    likes: 8,
    comment:
      "처음부터 끝까지 긴장감을 놓을 수 없었습니다. 배우들의 연기도 훌륭했고, 특히 송강호 배우의 연기가 인상적이었습니다. 다만 후반부 전개가 조금 아쉬웠습니다.",
    isOwnReview: false,
    hasSpoiler: false,
  },
  {
    id: 3,
    name: "박서연",
    date: "2023-08-05",
    rating: 5,
    likes: 15,
    comment:
      "한국 영화의 자부심을 느낄 수 있는 작품입니다. 계급 간의 갈등을 섬세하게 표현한 연출과 배우들의 열연이 돋보입니다. 여러 번 보면 볼수록 새로운 메시지를 발견할 수 있는 영화입니다.",
    isOwnReview: false,
    hasSpoiler: false,
  },
];

interface ReviewListProps {
  likedReviews: number[];
  reportedReviews: number[];
  userReview: Review | null;
  onLikeToggle: (reviewId: number) => void;
  onOpenReportModal: (reviewId: number) => void;
  onOpenDeleteModal: (reviewId: number) => void;
}

export default function ReviewList({
  likedReviews,
  reportedReviews,
  userReview,
  onLikeToggle,
  onOpenReportModal,
  onOpenDeleteModal,
}: ReviewListProps) {
  // 리뷰 데이터 상태 관리
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  // 스포일러가 표시된 리뷰 ID 목록
  const [revealedSpoilers, setRevealedSpoilers] = useState<number[]>([]);

  // 모든 리뷰 (샘플 리뷰 + 사용자 리뷰)
  const allReviews = userReview ? [userReview, ...reviews] : reviews;

  // 표시할 리뷰 (신고된 리뷰 제외)
  const visibleReviews = allReviews.filter((review) => !reportedReviews.includes(review.id));

  // 스포일러 토글 함수
  const toggleSpoiler = (reviewId: number) => {
    if (revealedSpoilers.includes(reviewId)) {
      setRevealedSpoilers(revealedSpoilers.filter((id) => id !== reviewId));
    } else {
      setRevealedSpoilers([...revealedSpoilers, reviewId]);
    }
  };

  // 좋아요 토글 함수
  const handleLike = (reviewId: number) => {
    // 부모 컴포넌트의 좋아요 상태 업데이트
    onLikeToggle(reviewId);

    // 리뷰의 좋아요 수 업데이트
    const isLiked = likedReviews.includes(reviewId);

    if (reviewId === userReview?.id) {
      // 사용자 리뷰는 업데이트하지 않음 (부모 컴포넌트에서 관리)
      return;
    }

    // 샘플 리뷰의 좋아요 수 업데이트
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, likes: isLiked ? review.likes - 1 : review.likes + 1 }
          : review
      )
    );
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">사용자 리뷰</h2>
      <div className="space-y-6">
        {visibleReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="flex">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {review.hasSpoiler && !revealedSpoilers.includes(review.id) ? (
              // 스포일러가 있고 아직 표시되지 않은 경우
              <div
                className="mb-4 p-4 bg-gray-100 rounded-md cursor-pointer"
                onClick={() => toggleSpoiler(review.id)}
              >
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">스포일러 경고</span>
                </div>
                <p className="mt-2 text-gray-500">
                  이 리뷰에는 영화의 스포일러가 포함되어 있습니다. 클릭하여 내용을 확인하세요.
                </p>
              </div>
            ) : (
              // 스포일러가 없거나 이미 표시된 경우
              <div className="mb-4">
                {review.hasSpoiler && (
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">스포일러 포함</span>
                    <button
                      className="text-xs text-blue-600 hover:underline ml-2"
                      onClick={() => toggleSpoiler(review.id)}
                    >
                      숨기기
                    </button>
                  </div>
                )}
                <p>{review.comment}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mt-2">
              <button
                className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm transition-colors ${
                  likedReviews.includes(review.id)
                    ? "bg-blue-50 border-blue-300 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleLike(review.id)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>좋아요 {review.likes}</span>
              </button>

              {review.isOwnReview ? (
                // 자신의 리뷰인 경우 삭제 버튼 표시
                <button
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  onClick={() => onOpenDeleteModal(review.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>삭제하기</span>
                </button>
              ) : (
                // 다른 사용자의 리뷰인 경우 신고 버튼 표시
                <button
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  onClick={() => onOpenReportModal(review.id)}
                >
                  <Flag className="w-4 h-4" />
                  <span>신고하기</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
