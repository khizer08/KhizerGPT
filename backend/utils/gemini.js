import "dotenv/config";
import Thread from "../models/thread.js";

const getGeminiAPIResponse = async (message) => {
  try {
    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // 2. Gemini API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0,
          },
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ") ||
      "No response";

    return reply;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default getGeminiAPIResponse;
