"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStatesByCountryName } from "@/services/countryStates";

export default function useCountryStates(countryName: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["countryStates", countryName],
    queryFn: () => fetchStatesByCountryName(countryName),
    enabled: !!countryName,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  return {
    states: data ?? [],
    isLoading,
    isError,
  };
}
