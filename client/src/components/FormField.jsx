function FormField({
  label,
  name,
  type = "text",
  as = "input",
  value,
  onChange,
  error,
  maxLength,
  placeholder,
  rows = 3,
  helperText,
  disabled = false,
  endAdornment,
}) {
  const sharedClassName = `w-full border rounded-lg p-3 ${
    endAdornment ? "pr-11" : ""
  } focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
    error
      ? "border-red-400 focus:ring-red-400"
      : "border-gray-300 focus:ring-blue-500"
  }`;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        {as === "textarea" ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
            disabled={disabled}
            className={sharedClassName}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
            disabled={disabled}
            className={sharedClassName}
          />
        )}

        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center px-3">
            {endAdornment}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <span />
        )}

        {helperText && (
          <p className="text-gray-400 text-xs">{helperText}</p>
        )}
      </div>
    </div>
  );
}

export default FormField;
