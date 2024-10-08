import { fetchRequest } from "@/commons/utils/fetch";

export const login = (params: any) => {
  return fetchRequest("/api/Login", {
    method: "POST",
    data: params,
  });
};

export const getinfosUser = () => {
  return fetchRequest("/api/User/GetLoginUser", {
    method: "GET",
  });
};

export const checkCode = (params: any) => {
  return fetchRequest("/api/Login/signin_sso", {
    method: "GET",
    data: params,
  });
};
