"use client";

import { useState } from "react";
import MovieDetails, { movieInfo } from "./components/movieDetail";
import ReviewForm from "./components/reviewForm";
import ReviewList, { type Review } from "./components/reviewList";
import ReportReview from "./components/reportReview";
import DeleteReview from "./components/deleteReview";

export default function MovieDetailPage() {
  // 사용자 리뷰 관련 상태
  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);

  // 좋아요 및 신고 관련 상태
  const [likedReviews, setLikedReviews] = useState<number[]>([]);
  const [reportedReviews, setReportedReviews] = useState<number[]>([]);

  // 모달 관련 상태
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // 리뷰 등록 함수
  const handleSubmitReview = (hasSpoiler: boolean) => {
    // 이미 리뷰를 작성한 경우 추가 리뷰 작성 방지
    if (userReview) {
      alert("이미 이 영화에 대한 리뷰를 작성하셨습니다.");
      return;
    }

    // 별점이나 내용이 없으면 등록하지 않음
    if (userRating === 0 || reviewContent.trim() === "") {
      alert("별점과 리뷰 내용을 모두 입력해주세요.");
      return;
    }

    // 현재 날짜 포맷팅 (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;

    // 새 리뷰 객체 생성
    const newReview: Review = {
      id: Date.now(), // 고유 ID 생성
      name: "사용자", // 실제로는 로그인된 사용자 이름을 사용할 수 있음
      date: formattedDate,
      rating: userRating,
      likes: 0,
      comment: reviewContent,
      isOwnReview: true, // 자신이 작성한 리뷰
      hasSpoiler: hasSpoiler, // 스포일러 포함 여부
    };

    // 사용자 리뷰 설정
    setUserReview(newReview);

    // 폼 초기화
    setUserRating(0);
    setReviewContent("");
  };

  // 좋아요 토글 함수
  const handleLikeToggle = (reviewId: number) => {
    // 이미 좋아요를 눌렀는지 확인
    const isLiked = likedReviews.includes(reviewId);

    if (isLiked) {
      // 좋아요 취소
      setLikedReviews(likedReviews.filter((id) => id !== reviewId));

      // 사용자 리뷰인 경우 좋아요 수 업데이트
      if (userReview && userReview.id === reviewId) {
        setUserReview({
          ...userReview,
          likes: userReview.likes - 1,
        });
      }
    } else {
      // 좋아요 추가
      setLikedReviews([...likedReviews, reviewId]);

      // 사용자 리뷰인 경우 좋아요 수 업데이트
      if (userReview && userReview.id === reviewId) {
        setUserReview({
          ...userReview,
          likes: userReview.likes + 1,
        });
      }
    }
  };

  // 신고 모달 열기
  const handleOpenReportModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setReportModalOpen(true);
  };

  // 삭제 모달 열기
  const handleOpenDeleteModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setDeleteModalOpen(true);
  };

  // 리뷰 신고 처리
  const handleReportReview = (reviewId: number) => {
    if (!reviewId) return;

    // 신고된 리뷰 목록에 추가
    setReportedReviews([...reportedReviews, reviewId]);

    // 모달 닫기
    setReportModalOpen(false);
    setSelectedReviewId(null);
  };

  // 리뷰 삭제 처리
  const handleDeleteReview = () => {
    // 사용자 리뷰 삭제
    setUserReview(null);

    // 모달 닫기
    setDeleteModalOpen(false);
    setSelectedReviewId(null);
  };

  return (
    <div className="container mx-auto px-40 py-10">
      {/* 영화 세부정보 컴포넌트 */}
      <MovieDetails {...movieInfo} />

      {/* 리뷰 작성 컴포넌트 */}
      <ReviewForm
        userRating={userRating}
        reviewContent={reviewContent}
        setUserRating={setUserRating}
        setReviewContent={setReviewContent}
        handleSubmitReview={handleSubmitReview}
        hasUserReview={!!userReview}
      />

      {/* 다른 사용자 리뷰 컴포넌트 */}
      <ReviewList
        likedReviews={likedReviews}
        reportedReviews={reportedReviews}
        userReview={userReview}
        onLikeToggle={handleLikeToggle}
        onOpenReportModal={handleOpenReportModal}
        onOpenDeleteModal={handleOpenDeleteModal}
      />

      {/* 신고 모달 */}
      <ReportReview
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportSubmitted={handleReportReview}
        reviewId={selectedReviewId}
      />

      {/* 삭제 모달 */}
      <DeleteReview
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteReview}
      />
    </div>
  );
}
