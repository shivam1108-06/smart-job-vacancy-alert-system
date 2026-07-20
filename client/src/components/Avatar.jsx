function Avatar({
  name,
  imageUrl,
  size = "w-24 h-24 sm:w-28 sm:h-28",
  textSize = "text-4xl sm:text-5xl",
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name ? `${name}'s avatar` : "User avatar"}
        className={`${size} rounded-full object-cover shrink-0 ring-4 ring-blue-100`}
      />
    );
  }

  return (
    <div
      className={`${size} ${textSize} rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 ring-4 ring-blue-100`}
    >
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export default Avatar;
