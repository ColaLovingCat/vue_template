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
export const saveUser = (data?: any) => {
  return fetchRequest(api + "/api/users/save", {
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

export const getlistRoles = (data?: any) => {
  return fetchRequest(api + "/api/roles/getlist", {
    method: "GET",
    data,
  });
};
export const saveRole = (data?: any) => {
  return fetchRequest(api + "/api/roles/save", {
    method: "POST",
    data,
  });
};
export const deleteRole = (data?: any) => {
  return fetchRequest(api + "/api/roles/delete", {
    method: "POST",
    data,
  });
};