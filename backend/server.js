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
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// API routes
app.use("/api", chatRoutes);

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// fallback for React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
