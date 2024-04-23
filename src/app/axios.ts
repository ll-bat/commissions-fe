import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Result } from "@/app/types/requestTypes";

const globalConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};

const client: AxiosInstance = axios.create(globalConfig);

async function runRequest(
  method: string,
  url: string,
  payload: any,
  config?: AxiosRequestConfig,
): Promise<Result<any>> {
  if (["POST", "PUT"].includes(method)) {
    // in this case, the arguments go like this: url, data, config
    config = config || {};
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
      result: response.data,
      errors: null,
    };
  } catch (errorResponse) {
    return {
      ok: false,
      result: null,
      errors: {
        // TODO handle other error cases
        nonFieldErrors: ["Something went wrong. Please, try again"],
      },
    };
  }
}

const axiosClient = {
  get: async (url: string, config?: AxiosRequestConfig) =>
    await runRequest("GET", url, null, config),
  post: async (url: string, payload: any, config?: AxiosRequestConfig) =>
    await runRequest("POST", url, payload, config),
  put: async (url: string, payload: any, config?: AxiosRequestConfig) =>
    await runRequest("PUT", url, payload, config),
  delete: async (url: string, config?: AxiosRequestConfig) =>
    await runRequest("DELETE", url, null, config),
  patch: async (url: string, payload: any, config?: AxiosRequestConfig) =>
    await runRequest("PATCH", url, payload, config),
};

export default axiosClient;
