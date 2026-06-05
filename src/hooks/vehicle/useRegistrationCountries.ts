"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { COUNTRIES_QUERY_KEY } from "@/data/countries";
import { RegistrationCountry } from "@/services/countryStates";

export default function useRegistrationCountries() {
  const http = useHttp();

  const { data, isLoading, isError } = useQuery({
    queryKey: [COUNTRIES_QUERY_KEY],
    queryFn: async () => {
      const res = await http.get<{ data: RegistrationCountry[] }>("/countries");
      return res?.data ?? [];
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  return {
    countries: data ?? [],
    isLoading,
    isError,
  };
}
