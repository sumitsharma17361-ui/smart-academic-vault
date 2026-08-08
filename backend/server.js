const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
    res.send("BMGI Academic Vault & Grok Backend Running!");
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

// Real Grok API Endpoint Call with Auto Model Detection
app.post('/api/ai-assistant', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    const GROK_API_KEY = process.env.GROK_API_KEY;

    if (!GROK_API_KEY) {
        return res.json({
            result: `🤖 **[System Mode]**\n\nAapka Question: "${prompt}"\n\n*(Note: Grok API Key Render environment variables mein add nahi hai.)*`
        });
    }

    try {
        // Step 1: Fetch Available Models from xAI
        let activeModel = "grok-2";
        const modelsResponse = await fetch("https://api.x.ai/v1/models", {
            headers: { "Authorization": `Bearer ${GROK_API_KEY}` }
        });
        
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            if (modelsData.data && modelsData.data.length > 0) {
                // Select the first valid model returned by xAI for your API key
                activeModel = modelsData.data[0].id;
                console.log("Using active xAI model:", activeModel);
            }
        }

        // Step 2: Send Completion Request using detected model
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: activeModel,
                messages: [
                    { role: "system", content: "You are a helpful academic AI tutor for Computer Science students at BM Group of Institutions (BMGI)." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ result: data.choices[0].message.content });
        } else {
            res.json({ result: "Grok API Response Error: " + (data.error?.message || JSON.stringify(data)) });
        }
    } catch (err) {
        console.error("Grok API Error:", err);
        res.status(500).json({ result: "Server error while contacting Grok API." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
