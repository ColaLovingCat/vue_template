import { fetchRequest } from "@/commons/utils/fetch";

const api = import.meta.env.VITE_APP_COMMON_URL;
export const health = (data?: any) => {
  return fetchRequest(api + "/api/health", {
    method: "GET",
    data,
  });
};

export const getinfosUser = (data?: any) => {
  return fetchRequest(api + "/api/auth/getinfos", {
    method: "GET",
    data,
  });
};

export const getinfosAzure = (data?: any) => {
  return fetchRequest(api + "/api/azure/configs", {
    method: "GET",
    data,
  });
};
export const loginAzure = (data?: any) => {
  return fetchRequest(api + "/api/azure/login", {
    method: "POST",
    data,
  });
};

export const login = (data?: any) => {
  return fetchRequest(api + "/api/auth/login", {
    method: "POST",
    data,
  });
};

export const loginiUser = (data?: any) => {
  return fetchRequest(api + "/api/iusers/login", {
    method: "POST",
    data,
  });
};
export const searchiUser = (data?: any) => {
  return fetchRequest(api + "/api/iusers/search", {
    method: "GET",
    data,
  });
};
