import NoImage from "../assets/no-image/no-image-icon.png";

export const renderAvatar = (photo) => {
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Case 1: No photo provided
  if (!photo) {
    return (
      <div
        className="h-[30px] w-[30px] rounded-full"
        style={{
          background:
            "linear-gradient(180deg, #6B88A2 0%, rgba(107, 136, 162, 0.8) 100%)",
        }}
      />
    );
  }

  // Case 2: Check if photo is a full URL
  const isFullUrl = photo.startsWith("http://") || photo.startsWith("https://");
  const imageUrl = isFullUrl ? photo : `${apiBaseUrl}${photo}`;

  return (
    <div className="relative h-[30px] w-[30px] rounded-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="User avatar"
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = "block";
            }
          }}
        />
      ) : null}

      {/* Dummy fallback */}
      <div
        className="h-full w-full rounded-full absolute top-0 left-0"
        style={{
          background:
            "linear-gradient(180deg, #6B88A2 0%, rgba(107, 136, 162, 0.8) 100%)",
          display: !imageUrl ? "block" : "none",
        }}
      />
    </div>
  );
};

export const renderImage = (image) => {
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Case 1: No image provided
  if (!image) {
    return (
      <img
        src={NoImage}
        alt="No image"
        className="w-full h-full object-cover"
      />
    );
  }

  // Case 2: Check if image is a full URL
  const isFullUrl = image.startsWith("http://") || image.startsWith("https://");
  const imageUrl = isFullUrl ? image : `${apiBaseUrl}${image}`;

  return (
    <img
      src={imageUrl}
      alt="User avatar"
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null; // prevent infinite loop
        e.target.src = NoImage;
      }}
    />
  );
};
