// Auto translate Indonesian text to Japanese using basic mapping + free API
// For common CV phrases and editable fields

const COMMON_TRANSLATIONS = {
  // Kelebihan/Kekurangan common phrases
  "bertanggung jawab": "責任感がある",
  "tidak mudah menyerah": "諦めない",
  "mudah beradaptasi": "適応力がある",
  "bekerja dalam tim": "チームワーク",
  "disiplin": "規律正しい",
  "teliti": "丁寧",
  "cepat belajar": "学習能力が高い",
  "penyabar": "忍耐強い",
  "ramah": "親切",
  "ceria": "明るい",
  "mudah lupa": "忘れっぽい",
  "pemalu": "人見知り",
  "gugup": "緊張しやすい",
  // Pekerjaan
  "petani": "農業",
  "pedagang": "商人",
  "ibu rumah tangga": "主婦",
  "pelajar": "学生",
  "karyawan": "会社員",
  "wiraswasta": "自営業",
  "guru": "教師",
  "sopir": "運転手",
  "buruh": "労働者",
};

// Use Google Translate API (free tier with API key)
export async function translateToJapanese(text, apiKey) {
  if (!text || text.trim() === "") return "";
  
  // Check if already Japanese
  if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text)) {
    return text;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "id",
        target: "ja",
        format: "text",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data.translations[0].translatedText;
    }
  } catch (err) {
    console.warn("Translation API failed, using fallback:", err.message);
  }

  // Fallback: simple word replacement
  let result = text.toLowerCase();
  for (const [id, jp] of Object.entries(COMMON_TRANSLATIONS)) {
    result = result.replace(new RegExp(id, "gi"), jp);
  }
  return result === text.toLowerCase() ? text : result;
}

// Batch translate multiple fields
export async function batchTranslate(fields, apiKey) {
  const results = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      results[key] = await translateToJapanese(value, apiKey);
    } else {
      results[key] = "";
    }
  }
  return results;
}
