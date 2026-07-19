import api from "./api";

export const getProfile = () => {
  return api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
