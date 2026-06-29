import { NextResponse } from "next/server";

const API_KEY = "AIzaSyAWlNi_iBOWxZBD6E20aHOSrRpPsirDdOM";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, source = "id", target = "ja" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ translation: "" });
    }

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

    if (!res.ok) {
      const errData = await res.json();
      console.error("Translation API error:", errData);
      return NextResponse.json(
        { error: errData.error?.message || "Translation failed", translation: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    const translation = data.data.translations[0].translatedText;

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json({ error: err.message, translation: "" }, { status: 500 });
  }
}
