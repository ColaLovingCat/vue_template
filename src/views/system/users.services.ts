import { fetchRequest } from "@/commons/utils/fetch";

const api = import.meta.env.VITE_APP_COMMON_URL;
export const getlistUsers = (data?: any) => {
  return fetchRequest(api + "/api/users/getlist", {
    method: "POST",
    data,
  });
};

export const getinfosUsers = (data?: any) => {
  return fetchRequest(api + "/api/users/getinfos", {
    method: "GET",
    data,
  });
};

export const addUser = (data?: any) => {
  return fetchRequest(api + "/api/users/create", {
    method: "POST",
    data,
  });
};

export const updateUser = (data?: any) => {
  return fetchRequest(api + "/api/users/update", {
    method: "POST",
    data,
  });
};

export const deleteUser = (data?: any) => {
  return fetchRequest(api + "/api/users/delete", {
    method: "POST",
    data,
  });
};