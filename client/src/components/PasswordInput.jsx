import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormField from "./FormField";

function PasswordInput({ disabled, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      disabled={disabled}
      endAdornment={
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((prev) => !prev)}
          className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      }
    />
  );
}

export default PasswordInput;
