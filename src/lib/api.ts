import { loginAction } from "@/src/commands/auth/login";
import { loadCredentials, saveCredentials } from "@/src/misc/credentials";
import type { ErrorResponse, SuccessResponse } from "@/src/misc/types";
import { log } from "@clack/prompts";
import axios, {
  AxiosError,
  isAxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.BACKEND_PORT || 6060}`
    : `https://hng-i14-task-3-david-uzondu-backend.vercel.app`; // TODO: Replace prod backend URL with the updated one
const instance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  headers: {
    "X-CLI-Name": "insighta",
    "X-API-Version": "1",
  },
});

instance.interceptors.request.use((config) => {
  const credentials = loadCredentials(false);
  if (credentials?.access_token) {
    config.headers["Cookie"] = `access_token=${credentials.access_token}`;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { retried?: boolean };

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig;
    if (error.response?.status === 401 && originalRequest?.retried !== true) {
      try {
        originalRequest.retried = true;

        const credentials = loadCredentials(false);
        if (!credentials) {
          log.info(
            "You're currently logged out. Attempting re-authentication...",
          );
          await loginAction();
        }

        try {
          const { data, headers } = await axios.post(
            BASE_URL + "/auth/refresh",
            {
              refresh_token: loadCredentials(false)!.refresh_token,
            },
          );

          const setCookie = headers["set-cookie"]?.find((c: string) =>
            c.startsWith("access_token="),
          );
          const newAccessToken = setCookie?.split(";")[0]?.split("=")[1];

          // if (data)
          //   saveCredentials({
          //     ...loadCredentials()!,
          //     access_token: data.access_token,
          //   });

          if (data) {
            saveCredentials({
              ...loadCredentials()!,
              access_token: data.access_token,
            });
          }

          instance.defaults.headers.common["Cookie"] =
            `access_token=${newAccessToken}`;

          return instance(originalRequest);
        } catch (error) {
          if (isAxiosError(error) && error.status === 401) {
            log.info(
              "You're currently logged out. Attempting re-authentication...",
            );
            await loginAction();

            instance.defaults.headers.common["Cookie"] =
              `access_token=${loadCredentials()!.access_token}`;
            return instance(originalRequest);
          } else {
            throw error;
          }
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export async function request<T, D = SuccessResponse | ErrorResponse>(
  config: AxiosRequestConfig<T>,
): Promise<AxiosResponse<D, object, object>> {
  return await instance({
    ...config,
  });

  //   try {
  //     return await instance({
  //       ...config,
  //     });
  //   } catch (error) {
  //     console.log(
  //       isAxiosError(error)
  //         ? (error.response?.data?.message ?? error.message)
  //         : "Something went wrong!",
  //     );
  //     // throw error;`cls
  //   }
}
