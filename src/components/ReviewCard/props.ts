import { Review, ReviewReply } from "@/types";

export interface ReviewCardProps {
    review: Review | ReviewReply;
    onClick?: () => void;
    isReviewDetail?: boolean;
    isSelected?: boolean;
    size?: string;
    gap?: string;
}