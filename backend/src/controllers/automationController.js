import axios from 'axios';

export const triggerAutomationWorkflow = async (req, res, next) => {
  try {
    const { recipientEmail, query, extractedPairs, rawTextContext } = req.body;

    if (!recipientEmail || !extractedPairs || !query) {
      return res.status(400).json({ error: 'Incomplete workflow contextual parameter properties payload.' });
    }

    if (!process.env.N8N_WEBHOOK_URL) {
      return res.status(500).json({ error: 'Target automation channel connector runtime URL configurations unresolved.' });
    }

    // Post payload object down to active n8n instance
    const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
      recipientEmail,
      query,
      extractedPairs,
      rawTextContext
    });

    //  Forward generated orchestration data back 
    res.json(n8nResponse.data);

  } catch (error) {
    console.error('External n8n Communication Fault Trace:', error.message);
    res.status(502).json({ 
      error: 'Orchestration runtime execution aborted across downstream automated nodes.',
      details: error.response?.data || error.message 
    });
  }
};