/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELocalStorageKeys } from "@/constants/enum";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type RequestMethod =
  | "GET"
  | "GET_WITHOUT_AUTH"
  | "POST"
  | "POST_WITHOUT_AUTH"
  | "PUT"
  | "PATCH"
  | "PATCH_WITHOUT_AUTH"
  | "DELETE";

export interface IHttpResponse<T> {
  data: T;
}

function getAuthToken(): string | null {
  const authStorage: string =
    localStorage.getItem(ELocalStorageKeys.AUTH_STORE) ?? "";
  const { state } = JSON.parse(authStorage);
  return state?.authToken ?? null;
}

function clearTokens() {
  localStorage.removeItem(ELocalStorageKeys.AUTH_STORE);
}

export default function useAxios() {
  const baseURL: string = import.meta.env.VITE_DARPANET_HOST;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "",
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const authToken = getAuthToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    async (response) => {
      return response;
    },
    function (error: AxiosError) {
      if (error.response && error.response.status === 401) {
        clearTokens(); // Clear tokens on 401 Unauthorized responses
      }
      return Promise.reject(error);
    }
  );

  async function request<T>(
    method: RequestMethod,
    endpoint = "",
    body = {}
  ): Promise<AxiosResponse<T> | undefined> {
    const url = `${baseURL}${endpoint}`;
    let data: AxiosResponse<T> | undefined;

    const isFormData = body instanceof FormData;

    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        Authorization: "",
      },
    };

    const reqBody = isFormData
      ? body
      : method !== "GET" &&
        method !== "GET_WITHOUT_AUTH" &&
        JSON.stringify(body);

    if (method === "GET") {
      data = await axiosInstance.get(url, { params: body });
    } else if (method === "GET_WITHOUT_AUTH") {
      data = await axios.get(url, { params: body });
    } else if (method === "DELETE") {
      console.log(reqBody);
      data = await axiosInstance.delete(url,{
        data:reqBody as any
      });
    } else if (method === "POST") {
      data = await axiosInstance.post(url, reqBody, config);
    } else if (method === "POST_WITHOUT_AUTH") {
      data = await axios.post(url, reqBody, config);
    } else if (method === "PUT") {
      data = await axiosInstance.put(url, reqBody);
    } else if (method === "PATCH") {
      data = await axiosInstance.patch(url, reqBody, config);
    } else if (method === "PATCH_WITHOUT_AUTH") {
      data = await axios.patch(url, reqBody, config);
    }
    return data;
  }

  async function getWithAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("GET", url, data);
  }

  async function getWithoutAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("GET_WITHOUT_AUTH", url, data);
  }

  async function postWithAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("POST", url, data);
  }

  async function postWithoutAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("POST_WITHOUT_AUTH", url, data);
  }

  async function putWithAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("PUT", url, data);
  }

  async function patchWithoutAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("PATCH_WITHOUT_AUTH", url, data);
  }

  async function patchWithAuth<T>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("PATCH", url, data);
  }

  async function deleteWithAuth<T>(
    url: string,
    data?:any
  ): Promise<AxiosResponse<T> | undefined> {
    return await request<T>("DELETE", url,data);
  }

  return {
    getWithAuth,
    getWithoutAuth,
    postWithAuth,
    postWithoutAuth,
    putWithAuth,
    patchWithAuth,
    patchWithoutAuth,
    deleteWithAuth,
  };
}
