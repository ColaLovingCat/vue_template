import { fetchRequest } from "@/commons/utils/fetch";

// export const login = (data?: any) => {
//   return fetchRequest("/api/Login", {
//     method: "POST",
//     data,
//   });
// };

// export const getinfosUser = (data?: any) => {
//   return fetchRequest("/api/User/GetLoginUser", {
//     method: "GET",
//   });
// };

export const checkCode = (data?: any) => {
  return fetchRequest("/api/Login/signin_sso", {
    method: "GET",
    data,
  });
};

const api = import.meta.env.VITE_APP_COMMON_URL;
export const getinfosAzure = (data?: any) => {
  return fetchRequest(api + "/api/azure/configs", {
    method: "GET",
  });
};
export const loginAzure = (data?: any) => {
  return fetchRequest(api + "/api/azure/login", {
    method: "POST",
    data,
  });
};

export const getinfosUser = (data?: any) => {
  return fetchRequest(api + "/api/auth/getinfos", {
    method: "GET",
    data,
  });
};

export const login = (data?: any) => {
  return fetchRequest(api + "/api/auth/login", {
    method: "POST",
    data,
  });
};
