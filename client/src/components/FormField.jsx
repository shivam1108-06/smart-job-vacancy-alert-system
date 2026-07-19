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
}) {
  const sharedClassName = `w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition ${
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

      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
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
          className={sharedClassName}
        />
      )}

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
