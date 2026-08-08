// Render Backend Live URL
const API_BASE_URL = "https://smart-academic-vault.onrender.com/api";

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

// Fetch Notes from Backend API
async function fetchNotes() {
    const container = document.getElementById('notes-container');
    const subjectFilter = document.getElementById('subject-filter').value;

    try {
        const response = await fetch(`${API_BASE_URL}/notes`);
        const notes = await response.json();

        if (!notes || notes.length === 0) {
            container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Koi notes uplabdh nahi hain.</p>`;
            return;
        }

        // Clear existing static items
        container.innerHTML = '';

        // Filter & Render dynamic cards
        notes.forEach(note => {
            if (subjectFilter === 'all' || note.subject.toLowerCase() === subjectFilter.toLowerCase()) {
                const card = document.createElement('div');
                card.className = "bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center";
                card.innerHTML = `
                    <div>
                        <span class="text-xs text-indigo-400 font-semibold uppercase">${note.subject}</span>
                        <h3 class="font-bold text-md mt-0.5">${note.title}</h3>
                        <p class="text-xs text-gray-400">Uploaded by ${note.uploadedBy || 'Faculty'}</p>
                    </div>
                    <a href="${note.fileUrl || '#'}" target="_blank" class="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-indigo-400">
                        <i class="fa-solid fa-download"></i>
                    </a>
                `;
                container.appendChild(card);
            }
        });
    } catch (err) {
        console.error("Notes fetch karne me error:", err);
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

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
});
