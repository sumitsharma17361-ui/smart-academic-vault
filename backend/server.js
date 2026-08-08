const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable CORS for all domains
app.use(cors());
app.use(express.json());

// Root Route check karne ke liye ki server live hai ya nahi
app.get('/', (req, res) => {
    res.send("Campus Vault Backend Server Running!");
});

// Mock Notes Route (Bina DB dependency ke instant testing ke liye)
app.get('/api/notes', (req, res) => {
    res.json([
        {
            title: "Process Scheduling Algorithms PDF",
            subject: "Operating Systems",
            uploadedBy: "CSE Department",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            title: "SQL Queries Cheat Sheet",
            subject: "DBMS",
            uploadedBy: "Rahul Sir",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
    ]);
});

// AI Assistant Route
app.post('/api/ai-assistant', (req, res) => {
    const { prompt } = req.body;
    res.json({
        result: `🤖 **AI Response:**\n\nAapke question ("${prompt || 'No question'}") ka key answer yeh hai ki Operating Systems mein Process Scheduling algorithms CPU execution efficiency ko max level par optimize karte hain.`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
