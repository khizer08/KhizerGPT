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

import getGeminiAPIResponse from "./gemini.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/chat", getGeminiAPIResponse);