const STRENGTH_LEVELS = [
  { label: "Very Weak", className: "bg-red-500" },
  { label: "Weak", className: "bg-orange-500" },
  { label: "Fair", className: "bg-yellow-500" },
  { label: "Good", className: "bg-blue-500" },
  { label: "Strong", className: "bg-green-500" },
];

const getPasswordScore = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
};

function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const score = getPasswordScore(password);
  const level = STRENGTH_LEVELS[Math.max(score - 1, 0)];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {STRENGTH_LEVELS.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              index < score ? level.className : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-1">{level.label}</p>
    </div>
  );
}

export default PasswordStrengthMeter;
