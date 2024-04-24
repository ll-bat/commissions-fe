import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { type Result } from "@/app/types/requestTypes";

const globalConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};

const client: AxiosInstance = axios.create(globalConfig);

async function runRequest<T>(
  method: string,
  url: string,
  payload: unknown,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  if (["POST", "PUT"].includes(method)) {
    // in this case, the arguments go like this: url, data, config
    config = config ?? {};
    if (!config.headers) {
      config.headers = {};
    }
    if (payload instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }
  try {
    const response = await client.request({
      method,
      url,
      data: payload,
      ...config,
    });
    return {
      ok: true,
      result: response.data as T,
      errors: null,
    };
  } catch (errorResponse: unknown) {
    const axiosError = errorResponse as AxiosError<string, unknown>;
    const errorData =
      axiosError.response?.data ?? "Something went wrong. Please, try again";
    return {
      ok: false,
      result: null,
      errors: {
        // handle other error cases
        nonFieldErrors: [errorData],
      },
    };
  }
}

const axiosClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig) =>
    await runRequest<T>("GET", url, null, config),
  post: async <T>(url: string, payload: unknown, config?: AxiosRequestConfig) =>
    await runRequest<T>("POST", url, payload, config),
  put: async <T>(url: string, payload: unknown, config?: AxiosRequestConfig) =>
    await runRequest<T>("PUT", url, payload, config),
  delete: async <T>(url: string, config?: AxiosRequestConfig) =>
    await runRequest<T>("DELETE", url, null, config),
  patch: async <T>(
    url: string,
    payload: unknown,
    config?: AxiosRequestConfig,
  ) => await runRequest<T>("PATCH", url, payload, config),
};

export default axiosClient;
