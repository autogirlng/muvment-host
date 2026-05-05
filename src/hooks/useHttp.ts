import { useMemo } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useSession, signOut } from "next-auth/react";
import { baseAPIURL } from "@/utils/constants";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse } from "@/types";

export const useHttp = () => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const http = useMemo(() => {
    const instance = axios.create({
      baseURL: baseAPIURL,
      timeout: 20000,
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [token]);

  const handleAuthError = (error: AxiosError<ErrorResponse>) => {
    if (
      error?.response?.data?.data === "NOT_PERMITTED_REAUTHENICATE" ||
      error?.response?.status === 401
    ) {
      signOut({ callbackUrl: "/login?session_expired=true" });
      return true;
    }
    return false;
  };

  return {
    get: async <T>(url: string) => {
      try {
        const response = await http.get<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          // throw new Error(error.response?.data.message);
          
        }
        throw error;
      }
    },

    post: async <T>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig<any>
    ) => {
      try {
        const response = await http.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message ?? error.message);
        }
        throw error;
      }
    },

    put: async <T>(url: string, data?: any) => {
      try {
        const response = await http.put<T>(url, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },

      patch: async <T>(url: string, data?: any,  config?: AxiosRequestConfig<any>) => {
      try {
        const response = await http.patch<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },

    delete: async <T>(url: string) => {
      try {
        const response = await http.delete<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
  };
};
