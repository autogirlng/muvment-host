import { User } from "@/types";
import { ReactNode } from "react";


export interface BaseResponse {
  status: string,
  message: string,
  errorCode: string,
  timestamp: string
}


export interface ErrorResponse {
    status: string,
    data: string,
    timestamp: string
}
export type MappedInformation = {
  [key: string]: string | number;
};

type CalendarValuePiece = Date | null;

export type CalendarValue =
  | CalendarValuePiece
  | [CalendarValuePiece, CalendarValuePiece];

export type Review = {
  id: string;
  rating: number;
  message: string;
  userId: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  Reply?: ReviewReply[];
};

export type ReviewReply = {
  id: string;
  message: string;
  userId: string;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

export type DateRange = { startDate: Date | null; endDate: Date | null };

export type ReviewsDataType = {
  data: Review[];
  totalCount: number;
};

export interface Extras {
  name: string;
  icon: ReactNode;
  id: string;
};
