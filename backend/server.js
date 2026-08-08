const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
    res.send("BMGI Academic Vault & Groq AI Backend Running!");
});

// Semester 5 Notes Route
app.get('/api/notes', (req, res) => {
    res.json([
        {
            title: "Computer Networks Unit-1 (OSI & TCP/IP)",
            subject: "Computer Networks",
            uploadedBy: "BMGI CSE Faculty",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            title: "Software Engineering Agile & SDLC Notes",
            subject: "Software Engineering",
            uploadedBy: "Prof. Sharma",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            title: "Web Tech Express & Node.js Guide",
            subject: "Web Technologies",
            uploadedBy: "BMGI CSE Lab",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
    ]);
});

// Super-fast Groq AI Assistant Endpoint with Conversation Memory
app.post('/api/ai-assistant', async (req, res) => {
    const { prompt, history } = req.body;

    if (!prompt && (!history || history.length === 0)) {
        return res.status(400).json({ error: "Prompt or message history is required" });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return res.json({
            result: `🤖 **[System Mode]**\n\n*(Note: Groq API Key is missing on Render settings.)*`
        });
    }

    try {
        // Construct chat messages array with system prompt + history + current prompt
        let conversationMessages = [
            { 
                role: "system", 
                content: "You are an expert academic AI tutor for Computer Science students at BM Group of Institutions (BMGI). Provide clear, concise, and helpful answers. Remember user details and conversation context provided in previous turns." 
            }
        ];

        if (Array.isArray(history) && history.length > 0) {
            conversationMessages = conversationMessages.concat(history);
        } else if (prompt) {
            conversationMessages.push({ role: "user", content: prompt });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: conversationMessages,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ result: data.choices[0].message.content });
        } else {
            res.json({ result: "Groq API Error: " + (data.error?.message || JSON.stringify(data)) });
        }
    } catch (err) {
        console.error("Groq API Call Error:", err);
        res.status(500).json({ result: "Server error while connecting to AI assistant." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
