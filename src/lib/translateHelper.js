// Auto translate Indonesian text to Japanese via server-side API route

export async function translateToJapanese(text) {
  if (!text || text.trim() === "") return "";

  // Check if already mostly Japanese
  const jpChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g) || []).length;
  if (jpChars > text.length * 0.5) {
    return text;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source: "id", target: "ja" }),
    });

    const data = await res.json();

    if (data.translation) {
      return data.translation;
    }
    if (data.error) {
      console.warn("Translation error:", data.error);
      return text; // Return original if failed
    }
  } catch (err) {
    console.warn("Translation fetch failed:", err.message);
  }

  return text;
}

// Batch translate multiple fields
export async function batchTranslate(fields) {
  const results = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      results[key] = await translateToJapanese(value);
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } else {
      results[key] = "";
    }
  }
  return results;
}
