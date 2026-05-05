import { useMemo } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { signOut, getSession } from "next-auth/react";
import { clearUser } from "@/lib/features/userSlice";
import { getClientStore } from "@/lib/storeHolder";
import { baseAPIURL } from "@/utils/constants";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse } from "@/types";

function sentBearerAuthorization(headers: unknown): boolean {
  if (!headers || typeof headers !== "object") return false;
  const h = headers as Record<string, unknown> & {
    get?: (name: string) => unknown;
  };
  const fromGet =
    typeof h.get === "function" ? h.get("Authorization") : undefined;
  const v =
    fromGet ?? h.Authorization ?? h.authorization;
  return typeof v === "string" && v.length > 0;
}

export const useHttp = () => {
  const http = useMemo(() => {
    const instance = axios.create({
      baseURL: baseAPIURL,
      timeout: 20000,
    });

    instance.interceptors.request.use(async (config) => {
      const path = `${config.baseURL ?? ""}${config.url ?? ""}`;
      const publicAuth =
        path.includes("/auth/login") ||
        path.includes("/auth/signup") ||
        path.includes("/auth/forgot-password") ||
        path.includes("/auth/reset-password") ||
        path.includes("/auth/verify-account") ||
        path.includes("/auth/resend-verification") ||
        path.includes("/auth/request-phone-otp") ||
        path.includes("/auth/verify-phone");

      if (publicAuth) {
        delete config.headers.Authorization;
        return config;
      }

      const session = await getSession();
      const reduxToken = getClientStore()?.getState().user.userToken;
      const token = session?.user?.accessToken ?? reduxToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, []);

  const handleAuthError = (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status;
    const sentBearer = sentBearerAuthorization(error.config?.headers);

    if (error?.response?.data?.data === "NOT_PERMITTED_REAUTHENICATE") {
      getClientStore()?.dispatch(clearUser());
      signOut({ callbackUrl: "/login?session_expired=true" });
      return true;
    }

    if (
      (status === 401 || status === 403) &&
      sentBearer
    ) {
      getClientStore()?.dispatch(clearUser());
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
          if (handleAuthError(error)) throw error;
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
          if (handleAuthError(error)) throw error;
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
          if (handleAuthError(error)) throw error;
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
          if (handleAuthError(error)) throw error;
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
          if (handleAuthError(error)) throw error;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
  };
};
