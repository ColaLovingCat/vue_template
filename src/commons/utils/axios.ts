import axios, { type AxiosRequestConfig } from "axios";

import { type FetchOptions, checkAPI } from "./fetch";
import * as extend from "./extends";

export const axiosRequest = (
  url: string,
  options: FetchOptions = {},
  remarks = ""
) => {
  const method = (options.method || "GET").toUpperCase();
  const contentType = options.type || "application/json; charset=utf-8";
  const dataType = options.dataType || "json";

  const config: AxiosRequestConfig = {
    url: checkAPI(url),
    method,
    headers:
      contentType !== "none"
        ? {
            "Content-Type": contentType,
            Accept: "application/json,text/plain,*/*",
            ...options.headers,
          }
        : {
            ...options.headers,
          },
  };

  // 参数处理
  if (method === "GET") {
    config.params = options.data;
  } else {
    config.data =
      contentType === "application/json; charset=utf-8"
        ? JSON.stringify(options.data)
        : options.data;
  }

  if (remarks) console.log(`${remarks} Request:`, config);

  return new Promise((resolve, reject) => {
    instance(config)
      .then(async (res) => {
        const responseData = res.data;

        if (remarks) console.log(`${remarks}:`, responseData);

        if (options.activeBody) {
          const headers: { [key: string]: any } = {};
          Object.entries(res.headers).forEach(([key, value]) => {
            headers[key] = value;
          });
          resolve({ headers, body: responseData });
        } else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        if (remarks) console.error(`${remarks} Error:`, err);
        reject(err);
      });
  });
};

const instance = axios.create({
  timeout: 10000,
});
instance.interceptors.request.use(
  (config: any) => {
    const token = extend.ExLocalStore.get("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: token,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["token"];
    if (newToken) {
      extend.ExLocalStore.set("token", newToken);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      extend.ExLocalStore.delete("token");
    }
    return Promise.reject(error);
  }
);
