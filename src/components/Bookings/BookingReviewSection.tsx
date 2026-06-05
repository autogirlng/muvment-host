"use client";

import { format } from "date-fns";
import { Spinner, StarRating } from "@/ui";
import useBookingReview from "@/hooks/listings/useBookingReview";

type BookingReviewSectionProps = {
  bookingId: string;
  customerName?: string;
};

export default function BookingReviewSection({
  bookingId,
  customerName,
}: BookingReviewSectionProps) {
  const { review, isLoading } = useBookingReview(bookingId);

  const reviewerName = review?.isAnonymous
    ? review?.anonymousFullName || "Anonymous"
    : customerName || "Customer";

  let dateDisplay = "";
  try {
    if (review?.createdAt) {
      dateDisplay = format(new Date(review.createdAt), "MMM d, yyyy");
    }
  } catch {
    dateDisplay = "";
  }

  return (
    <div className="space-y-6">
      <p className="text-grey-700 text-sm 3xl:text-base uppercase !font-semibold">
        Reviews
      </p>

      <div className="rounded-2xl border border-grey-200 bg-white p-6 sm:p-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : !review ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-grey-100 text-grey-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.3l1.6-6.8L2.2 8.9l6.9-.6L12 2z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-grey-700">No reviews</p>
            <p className="text-xs text-grey-500">
              This booking has not been reviewed yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-grey-800">
                  {reviewerName}
                </p>
                {dateDisplay && (
                  <p className="text-xs text-grey-500">{dateDisplay}</p>
                )}
              </div>
              {typeof review.rating === "number" && (
                <div className="flex flex-col items-end gap-1">
                  <StarRating n={Math.round(review.rating)} />
                  <span className="text-xs font-medium text-grey-500">
                    {review.rating.toFixed(1)} / 5
                  </span>
                </div>
              )}
            </div>

            {review.review && (
              <div className="rounded-xl bg-grey-50 p-4 text-sm leading-relaxed text-grey-700">
                {review.review}
              </div>
            )}

            {review.recommend && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-grey-500">Recommends:</span>
                <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-600">
                  {review.recommend}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
