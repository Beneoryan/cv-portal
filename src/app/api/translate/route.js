import { NextResponse } from "next/server";

// Use a separate unrestricted API key for server-side calls
// If the main key is restricted, create a new one in GCP Console:
// APIs & Services > Credentials > Create Credentials > API Key
// Then restrict it to: Cloud Translation API only, with no application restrictions
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "AIzaSyAWlNi_iBOWxZBD6E20aHOSrRpPsirDdOM";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, source = "id", target = "ja" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ translation: "" });
    }

    // Try Google Translate API
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const translation = data.data.translations[0].translatedText;
      return NextResponse.json({ translation });
    }

    // If Google API fails, try free alternative (MyMemory)
    const altUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=id|ja`;
    const altRes = await fetch(altUrl);

    if (altRes.ok) {
      const altData = await altRes.json();
      if (altData.responseData && altData.responseData.translatedText) {
        return NextResponse.json({ translation: altData.responseData.translatedText });
      }
    }

    // Return error with original text
    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: errData.error?.message || "Translation APIs failed", translation: text },
      { status: 200 } // Return 200 so client can still use the fallback
    );
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json({ error: err.message, translation: "" }, { status: 500 });
  }
}
