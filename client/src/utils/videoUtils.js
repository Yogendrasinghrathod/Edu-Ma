export const convertToHlsUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  // Split the URL to insert the transformation
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // transformation: "sp_auto" automatically generates HLS manifests
  // and we change extension to .m3u8
  // e.g. https://res.cloudinary.com/demo/video/upload/sp_auto/v12345/dog.m3u8

  // Replace the extension .mp4 with .m3u8 (case insensitive)
  let publicIdWithExtension = parts[1];
  publicIdWithExtension = publicIdWithExtension.replace(/\.mp4$/i, ".m3u8");

  // Construct the new URL
  // "sp_auto" creates HLS adaptive streaming playlists
  return `${parts[0]}/upload/sp_auto/${publicIdWithExtension}`;
};
