import express from "express";
import Thread from "../models/thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

// test route to check if the db is working fine.
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing New Thread",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in db " });
  }
});

//get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    //descending order of updatedAt ...most recent data on top
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//get all messages for a thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//delete a thread and all its messages
router.delete("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      //create a new thread
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      //add message to existing thread
      thread.messages.push({ role: "user", content: message });
    }
    const assistantReply = await getGeminiAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
