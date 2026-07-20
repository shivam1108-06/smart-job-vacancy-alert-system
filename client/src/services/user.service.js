import api from "./api";

const authHeader = (extraHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...extraHeaders,
  },
});

export const getProfile = () => {
  return api.get("/auth/me", authHeader());
};

export const updateProfile = (data) => {
  return api.put("/auth/profile", data, authHeader());
};

export const changePassword = (data) => {
  return api.put("/auth/change-password", data, authHeader());
};

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  // Override the instance's default "application/json" Content-Type — with
  // it in place, axios JSON-stringifies the FormData instead of sending a
  // real multipart body, so Multer never sees a file. Setting it away from
  // "application/json" here lets axios leave the FormData untouched, which
  // in turn lets the browser attach the correct multipart boundary.
  return api.put(
    "/auth/upload-avatar",
    formData,
    authHeader({ "Content-Type": "multipart/form-data" })
  );
};
