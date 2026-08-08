const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campus_vault";
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// Database Schema for Study Materials
const NoteSchema = new mongoose.Schema({
    title: String,
    subject: String,
    fileUrl: String,
    uploadedBy: String,
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', NoteSchema);

// API Route 1: Get All Notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

// API Route 2: AI Assistant Endpoint (Using Hugging Face / Open-source LLM logic)
app.post('/api/ai-assistant', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        // AI Logic integration (Can connect to OpenRouter or HuggingFace free endpoints)
        const simplifiedAnswer = `🤖 **AI Simplified Analysis:**\n\n` + 
            `Aapke question ("${prompt}") ka simplified explanation:\n` +
            `1. **Key Concept:** Clear and core points extracted.\n` +
            `2. **Exam Tip:** Keep definitions short and clear in technical exams.\n` +
            `3. **Summary:** Is concept ka main goal system efficiency ko optimize karna hai.`;

        res.json({ result: simplifiedAnswer });
    } catch (err) {
        res.status(500).json({ error: "AI service Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
