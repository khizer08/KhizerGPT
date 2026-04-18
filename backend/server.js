// import { GoogleGenerativeAI } from "@google/generative-ai";
// import "dotenv/config";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function run() {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash-lite",
//   });

//   const prompt = "who won ipl 2008?";

//   const result = await model.generateContent(
//     prompt
//   );

//   const response = await result.response;
//   console.log(response.text());
// }

// run();

import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/test", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: req.body.message }],
        },
      ],
      generationConfig: {
        temperature: 0,
      },
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      options,
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ") ||
      "No response";

    res.json({ reply });
    // console.log("Reply sent to client:", reply); //reply
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
