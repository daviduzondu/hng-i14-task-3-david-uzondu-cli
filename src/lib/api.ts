import type { ErrorResponse, SuccessResponse } from "@/src/misc/types";
import type { createProfileSchema } from "@/src/validation/profile";
import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type z from "zod";

const instance = axios.create({
  baseURL:
    (process.env.NODE_ENV === "development"
      ? `http://localhost:${process.env.BACKEND_PORT}`
      : `http://hng-i14-task-2-david-uzondu-server-lime.vercel.app`)  // TODO: Replace prod backend URL with the updated one
});

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
