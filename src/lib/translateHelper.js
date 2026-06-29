// Auto translate Indonesian text to Japanese via server-side API route
// Uses Google Translate API on server side, with MyMemory as fallback

export async function translateToJapanese(text) {
  if (!text || text.trim() === "") return "";

  // Check if already mostly Japanese (more than 30% Japanese characters)
  const jpChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g) || []).length;
  if (jpChars > text.length * 0.3) {
    return text;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source: "id", target: "ja" }),
    });

    if (!res.ok) {
      console.warn("Translation API returned status:", res.status);
      return text;
    }

    const data = await res.json();

    if (data.translation && data.translation !== text) {
      return data.translation;
    }

    // If translation is same as input, API probably failed silently
    if (data.error) {
      console.warn("Translation error:", data.error);
    }

    return data.translation || text;
  } catch (err) {
    console.warn("Translation fetch failed:", err.message);
    return text;
  }
}

// Batch translate multiple fields with progress callback
export async function batchTranslate(fields, onProgress) {
  const results = {};
  const keys = Object.keys(fields);
  let done = 0;

  for (const key of keys) {
    const value = fields[key];
    if (value && value.trim()) {
      results[key] = await translateToJapanese(value);
      done++;
      if (onProgress) onProgress(done, keys.length);
      // Delay between calls to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } else {
      results[key] = "";
      done++;
    }
  }
  return results;
}
