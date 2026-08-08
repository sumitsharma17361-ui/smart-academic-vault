// Replace this with your backend Render API URL after deployment
const API_BASE_URL = "https://your-render-backend-url.onrender.com/api";

// Tab Switching Mechanism
function switchTab(tabName) {
    const vaultSec = document.getElementById('vault-section');
    const aiSec = document.getElementById('ai-section');
    const vaultTab = document.getElementById('tab-vault');
    const aiTab = document.getElementById('tab-ai');

    if (tabName === 'vault') {
        vaultSec.classList.remove('hidden');
        aiSec.classList.add('hidden');
        vaultTab.className = "flex-1 py-3 text-center border-b-2 border-indigo-500 font-semibold text-indigo-400";
        aiTab.className = "flex-1 py-3 text-center border-b-2 border-transparent text-gray-400";
    } else {
        vaultSec.classList.add('hidden');
        aiSec.classList.remove('hidden');
        aiTab.className = "flex-1 py-3 text-center border-b-2 border-indigo-500 font-semibold text-indigo-400";
        vaultTab.className = "flex-1 py-3 text-center border-b-2 border-transparent text-gray-400";
    }
}

// AI Question Asking Function
async function askAI() {
    const promptInput = document.getElementById('ai-input').value.trim();
    const btn = document.getElementById('ai-btn');
    const outputBox = document.getElementById('ai-output');
    const responseText = document.getElementById('ai-response-text');

    if (!promptInput) {
        alert("Kripya koi question ya text enter karein!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Thinking...";
    outputBox.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/ai-assistant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptInput })
        });

        const data = await response.json();
        responseText.innerText = data.result || "No response received.";
        outputBox.classList.remove('hidden');
    } catch (err) {
        alert("Backend API se connect nahi ho pa raha hai.");
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerText = "Ask AI Assistant";
    }
}
