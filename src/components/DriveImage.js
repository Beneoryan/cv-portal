"use client";

// Convert Google Drive sharing link to direct image URL
export function getDriveImageUrl(url) {
  if (!url) return null;
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/open\?id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=s200`;
    }
  }
  return url;
}

export default function DriveImage({ url, alt = "Photo", size = "w-12 h-12" }) {
  const imgUrl = getDriveImageUrl(url);
  
  if (!imgUrl) {
    return (
      <div className={`${size} bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs`}>
        No
      </div>
    );
  }

  return (
    <img
      src={imgUrl}
      alt={alt}
      className={`${size} rounded-full object-cover border border-gray-200`}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = `<div class="${size} bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">Err</div>`;
      }}
    />
  );
}
