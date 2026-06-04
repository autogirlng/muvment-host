"use client";

// The reviews endpoint /api/reviews/findonebooking/{id} is currently unavailable.
// Returns empty state until the API is ready.
export default function useVehicleReview(_: {
  id: string;
  currentPage: number;
  pageLimit: number;
}) {
  return {
    vehicleReviews: [],
    totalCount: 0,
    isError: false,
    isLoading: false,
  };
}
