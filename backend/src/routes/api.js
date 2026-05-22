import express from 'express';
import multer from 'multer';
import { processDocument } from '../controllers/documentController.js';
import { triggerAutomationWorkflow } from '../controllers/automationController.js';

const router = express.Router();

// Configure in-memory safe transient streaming block storage structures
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Cap at 10MB file target inputs maximum
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Mime type restriction exception: Only .pdf or .txt formats are allowed.'), false);
    }
  }
});

// Endpoint 1: Schema Miner
router.post('/extract', upload.single('file'), processDocument);


// Endpoint 2: n8n Flow Trigger Proxy Link
router.post('/automation', triggerAutomationWorkflow);

export default router;