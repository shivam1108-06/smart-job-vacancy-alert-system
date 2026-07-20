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

  // Clear the instance's default "application/json" Content-Type by setting
  // it to undefined (axios drops undefined headers entirely) rather than to
  // a literal "multipart/form-data" string, which has no boundary parameter
  // and breaks Multer's parsing. With no Content-Type header set, the browser
  // computes the correct "multipart/form-data; boundary=..." value itself.
  return api.put(
    "/auth/upload-avatar",
    formData,
    authHeader({ "Content-Type": undefined })
  );
};
