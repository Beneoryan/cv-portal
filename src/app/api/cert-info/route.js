import { NextResponse } from "next/server";

const API_KEY = "AIzaSyAWlNi_iBOWxZBD6E20aHOSrRpPsirDdOM";

// Extract file ID from Google Drive URL
function extractFileId(url) {
  if (!url) return null;
  const patterns = [
    /\/open\?id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { urls } = body; // Array of Google Drive URLs

    if (!urls || urls.length === 0) {
      return NextResponse.json({ files: [] });
    }

    const files = [];

    for (const url of urls) {
      const fileId = extractFileId(url);
      if (!fileId) continue;

      try {
        // Fetch file metadata from Google Drive API
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,createdTime&key=${API_KEY}`
        );

        if (res.ok) {
          const data = await res.json();
          files.push({
            url,
            fileId,
            name: data.name || "",
            mimeType: data.mimeType || "",
            createdTime: data.createdTime || "",
          });
        } else {
          files.push({ url, fileId, name: "Unable to fetch", mimeType: "", createdTime: "" });
        }
      } catch (err) {
        files.push({ url, fileId, name: "Error", mimeType: "", createdTime: "" });
      }
    }

    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: err.message, files: [] }, { status: 500 });
  }
}
