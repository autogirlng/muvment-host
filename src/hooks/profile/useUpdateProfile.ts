"use client";

import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse, ProfileFormValues, User, UpdateProfilePictureResponse } from "@/types";
import { updateUserData } from "@/lib/features/userSlice"
import { useHttp } from "@/hooks/useHttp";

export default function useUpdateProfile(
  setIsProfileEditable: Dispatch<SetStateAction<boolean>>
) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      http.patch<User>("/v1/users/me", { ...values }),

    onMutate: (values) => {
      return { ...values };
    },

    onSuccess: (data, _values, context) => {
      console.log("Update Profile successful", data);
      dispatch(updateUserData({ ...user, ...context }));
      setIsProfileEditable(false);
      toast.success("Profile Updated");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Profile"),
  });

  const uploadImage = useMutation({
    mutationFn: (values: FormData) =>
      http.patch<UpdateProfilePictureResponse>("/v1/users/me/profile-picture", values, { headers: { "Content-Type": "multipart/form-data" },}),

    onSuccess: (data) => {
      console.log("Update Image successful", data);
     if(user){
        dispatch(updateUserData({ ...user, data:{...user.data, profilePictureUrl:data?.data} }));
     }
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Image"),
  });

  return {
    updateProfileMutation,
    uploadImage,
  };
}
