export const convertToHlsUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  // Force HTTPS to avoid Mixed Content issues in production
  let secureUrl = url.replace(/^http:/i, "https:");

  // Split the URL to insert the transformation
  const parts = secureUrl.split("/upload/");
  if (parts.length !== 2) return secureUrl;

  // Replace common video extensions with .m3u8 (case insensitive)
  let publicIdWithExtension = parts[1];
  publicIdWithExtension = publicIdWithExtension.replace(
    /\.(mp4|mov|avi|mkv|webm)$/i,
    ".m3u8",
  );

  // Construct the new URL with "sp_auto" transformation
  // "sp_auto" automatically generates HLS adaptive streaming playlists
  return `${parts[0]}/upload/sp_auto/${publicIdWithExtension}`;
};
