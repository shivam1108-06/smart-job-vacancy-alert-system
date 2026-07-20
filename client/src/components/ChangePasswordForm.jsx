import { useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import Spinner from "./Spinner";
import { changePassword } from "../services/user.service";

const PASSWORD_MIN_LENGTH = 8;

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validatePasswordForm = (data) => {
  const errors = {};

  if (!data.currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!data.newPassword) {
    errors.newPassword = "New password is required.";
  } else if (data.newPassword.length < PASSWORD_MIN_LENGTH) {
    errors.newPassword = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  } else if (!/[A-Z]/.test(data.newPassword)) {
    errors.newPassword = "Password must contain an uppercase letter.";
  } else if (!/[a-z]/.test(data.newPassword)) {
    errors.newPassword = "Password must contain a lowercase letter.";
  } else if (!/[0-9]/.test(data.newPassword)) {
    errors.newPassword = "Password must contain a number.";
  } else if (
    data.currentPassword &&
    data.newPassword === data.currentPassword
  ) {
    errors.newPassword =
      "New password must be different from current password.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (
    data.newPassword &&
    data.confirmPassword !== data.newPassword
  ) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

function ChangePasswordForm({ onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePasswordForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);

      const response = await changePassword(form);

      toast.success(
        response.data.message || "Password updated successfully"
      );
      setForm(INITIAL_FORM);
      setErrors({});
      onCancel();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Invalid current password"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <PasswordInput
        label="Current Password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
        disabled={saving}
        placeholder="Enter current password"
      />

      <PasswordInput
        label="New Password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        disabled={saving}
        placeholder="Enter new password"
        helperText="Min 8 characters, with uppercase, lowercase & a number"
      />

      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={saving}
        placeholder="Re-enter new password"
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {saving && <Spinner />}
          {saving ? "Updating..." : "Change Password"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="flex-1 bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-800 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>

    </form>
  );
}

export default ChangePasswordForm;
