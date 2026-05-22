import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/api.js';

dotenv.config();

const app = express();

// Middleware pipeline
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// API Route declaration mapping
app.use('/api', apiRoutes);

// Global operational error tracking handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Exception:', err.message);
  res.status(500).json({ error: err.message || 'Internal pipeline execution fault.' });
});

app.get("/", (req, res) => {
  res.send("AI Document Orchestrator Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Orchestration routing matrix running on port ${PORT}`));