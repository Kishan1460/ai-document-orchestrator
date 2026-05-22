import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Critical Configuration Exception: Missing GEMINI_API_KEY parameter environment key.');
}

// Initializing verified structural GoogleGenAI client channel instance
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });