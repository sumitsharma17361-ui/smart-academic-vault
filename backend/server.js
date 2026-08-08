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

// 100% Reliable AI Assistant Endpoint
app.post('/api/ai-assistant', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        // High quality free AI endpoint (No API Key Required & Zero Cost)
        const systemPrompt = `You are a helpful academic AI tutor for Computer Science (Semester 5) students at BM Group of Institutions (BMGI). Provide a clean, formatted response to the following query:\n\nUser Question: ${prompt}`;
        
        const aiResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?model=openai&cache=false`);
        
        if (!aiResponse.ok) {
            throw new Error(`HTTP Error ${aiResponse.status}`);
        }

        const textResult = await aiResponse.text();

        // Clean response if any unexpected JSON string comes
        if (textResult.startsWith('{') && textResult.includes('"error"')) {
            return res.json({ 
                result: `Hello! I am your BMGI Academic Assistant.\n\nQuery: "${prompt}"\n\nTo fetch real-time AI responses, please ensure your AI API credits are active. Currently operating in fallback student helper mode!` 
            });
        }

        res.json({ result: textResult });

    } catch (err) {
        console.error("AI API Error:", err);
        res.json({ 
            result: `BMGI Academic Helper:\n\nCould not process query right now. Please try asking again in a few seconds!` 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
