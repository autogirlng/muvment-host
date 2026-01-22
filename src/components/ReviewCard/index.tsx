import cn from "classnames";
import Image from "next/image";
import { format } from "date-fns";
import { StarRating } from "@/ui";
import { ReviewCardProps } from "./props";


const ReviewCard = ({
    review,
    onClick,
    isReviewDetail,
    isSelected,
    size,
    gap,
}: ReviewCardProps) => {
    const isReview = "rating" in review;

    return (
        <div
            className={cn(
                "space-y-6",
                onClick && "cursor-pointer",
                isReviewDetail ? "" : "p-6 bg-grey-90 rounded-[32px]",
                isSelected && "border border-primary-500"
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-3 items-center">
                    {review?.user?.data.profilePictureUrl && (
                        <Image
                            src={review?.user?.data.profilePictureUrl}
                            alt=""
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    <div className="space-y-[2px]">
                        <p className="text-grey-700 text-sm 3xl:text-base">{`${review?.user?.data.firstName} ${review?.user?.data.lastName}`}</p>
                        <p className="text-grey-500 text-xs 3xl:text-sm">
                            {`${format(new Date(review?.updatedAt), "MMM d, yyyy")} | ${format(new Date(review?.updatedAt), "hh:mma")}`}
                        </p>
                    </div>
                </div>
                {isReview && review?.rating && (
                    <StarRating n={review.rating} size={size} gap={gap} />
                )}
            </div>
            <div className="text-black text-sm 3xl:text-base">{review.message}</div>
        </div>
    );
};

export default ReviewCard;
