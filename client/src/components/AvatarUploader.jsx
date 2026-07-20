import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import Spinner from "./Spinner";
import { uploadAvatar } from "../services/user.service";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function AvatarUploader({ name, avatarUrl, onUploaded }) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 2MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setUploading(true);

      const response = await uploadAvatar(file);

      toast.success(
        response.data.message || "Profile photo updated successfully"
      );
      onUploaded(response.data.user);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to upload photo"
      );
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center">

      <div className="relative">
        <Avatar name={name} imageUrl={preview || avatarUrl} />

        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className="mt-4 bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      <p className="text-gray-400 text-xs mt-2">
        JPG, JPEG or PNG. Max 2MB.
      </p>

    </div>
  );
}

export default AvatarUploader;
