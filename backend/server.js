const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
    res.send("BMGI Academic Vault Backend Running!");
});

// Semester 5 Sample Notes Route
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

// Smart Multi-AI Endpoint
app.post('/api/ai-assistant', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    const GROK_API_KEY = process.env.GROK_API_KEY;

    // List of model names xAI supports across different tiers
    const possibleModels = ["grok-2-1212", "grok-beta", "grok-vision-beta", "grok-1"];

    if (GROK_API_KEY) {
        for (let modelName of possibleModels) {
            try {
                const response = await fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${GROK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: [
                            { role: "system", content: "You are an expert Computer Science academic AI tutor for BM Group of Institutions (BMGI)." },
                            { role: "user", content: prompt }
                        ],
                        temperature: 0.7
                    })
                });

                const data = await response.json();

                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return res.json({ result: data.choices[0].message.content });
                }
            } catch (err) {
                console.log(`Failed model ${modelName}, trying next...`);
            }
        }
    }

    // High Quality Free AI Backup (In case Grok API key is invalid or model restricted)
    try {
        const backupAI = await fetch(`https://text.pollinations.ai/${encodeURIComponent("You are BMGI Academic AI Tutor. Answer this clearly for Semester 5 CSE student: " + prompt)}`);
        const textResult = await backupAI.text();
        return res.json({ result: textResult });
    } catch (fallbackErr) {
        return res.status(500).json({ result: "AI service currently busy. Please try again in a moment." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
