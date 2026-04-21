import "dotenv/config";
import fetch from "node-fetch";
import Thread from "./Thread.js";

const getGeminiAPIResponse = async (req, res) => {
  const { message, threadId } = req.body;

  try {
    // 1. Find or create thread
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        messages: [],
      });
    }

    // 2. Save user message
    thread.messages.push({
      role: "user",
      content: message,
    });

    // 3. Format history for Gemini
    const contents = thread.messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // 4. Gemini API call
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
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join(" ") || "No response";

    // 5. Save assistant response
    thread.messages.push({
      role: "assistant",
      content: reply,
    });

    thread.updatedAt = Date.now();

    await thread.save();

    // 6. Send response
    return res.json({
      reply,
      threadId: thread.threadId,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default getGeminiAPIResponse;