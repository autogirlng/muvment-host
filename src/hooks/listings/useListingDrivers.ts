import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { AssignNewDriver, ErrorResponse, AllDrivers } from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function useListingDrivers(id: string) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.user);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleModal = (value: boolean) => setOpenModal(value);

  const {
    data: drivers,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["myDrivers",user?.data.userId, id],

    queryFn: () => http.get<AllDrivers>(`/v1/drivers/my-drivers`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });
  console.log(drivers)

  const assignNewDriver = useMutation({
    mutationFn: (values: AssignNewDriver) => http.post<AssignNewDriver>(`/v1/drivers` , values),
    onSuccess: (data) => {
      console.log("Assign New Driver successful", data);

      queryClient.setQueryData(
        ["assignDriver", user?.data.userId, id],
        (oldData: AssignNewDriver[] | undefined) => {
          // If there's no existing data, return array with new driver
          if (!oldData) return [data];

          // Return new array with existing drivers plus new driver
          return [...oldData, data];
        }
      );

      handleModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Assign New Driver"),
  });

  return {
    isError,
    isLoading,
    openModal,
    handleModal,
    assignNewDriver,
    drivers,
  };
}
