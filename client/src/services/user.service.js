import api from "./api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProfile = () => {
  return api.get("/auth/me", authHeader());
};

export const updateProfile = (data) => {
  return api.put("/auth/profile", data, authHeader());
};
