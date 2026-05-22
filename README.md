# 📑 OmniDoc AI: Intelligent Document Parsing & Automation Pipeline

OmniDoc AI is a full-stack, automated document intelligence platform that extracts, analyzes, and processes unstructured text-only PDF documents (such as digital invoices, legal contracts, and corporate meeting notes).

The application utilizes a Node.js/Express backend to extract raw text content using `pdf-parse`, pipes the contextual data into an n8n automated workflow engine, leverages Google Gemini AI models for multi-document reasoning, and triggers automated email summaries.

---

## 🏗️ System Architecture & Workflow

1. **Frontend:** A React interface allows users to upload a text-only PDF and type a contextual question.
2. **Backend Server:** An Express app intercepts the binary file data in-memory via `multer`, extracts raw string layouts using `pdf-parse`, and cleans up Unicode structural glitches.
3. **Automation Pipeline:** The server transmits the payload directly into an active n8n webhook workflow.
4. **AI Generation:** An n8n Advanced AI Agent running `gemini-2.5-flash` analyzes the context to calculate financial ledger totals, assess legal clauses, or summarize minutes.
5. **Execution Alert:** A clean, white-labeled email notification is dispatched through the Google Mail delivery node.

---

## 🛠️ Tech Stack

* **Frontend:** React, HTML5, CSS3, JavaScript (ES6+), `FormData` API
* **Backend:** Node.js, Express.js, `multer` (In-Memory buffer storage), `pdf-parse` (Text extraction)
* **Automation:** n8n Workflow Automation Engine, Webhooks, Advanced AI Agent framework
* **AI Engine:** Google AI Studio (`gemini-2.5-flash` Multimodal Core)
* **Hosting Platforms:** Vercel (Frontend), Render (Backend Service)

---

## 🔒 Security & Environment Configuration

This project enforces strict zero-leakage security boundaries. All secret tokens, pipeline connection URLs, and API keys are completely isolated from GitHub using `.gitignore` configurations. 

### Local Setup (`.env`)
Create a `.env` file in your root directories matching this template:

**Backend Environment:**
```env
PORT=5000
GEMINI_API_KEY=your_google_ai_studio_api_key_here
N8N_WEBHOOK_URL=your_live_production_n8n_webhook_endpoint

### Installation

# Clone the repository
git clone https://github.com/Kishan1460/ai-document-orchestrator.git

# Install dependencies
npm install

# Start the development server
npm run dev

