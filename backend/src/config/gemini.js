import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Critical Configuration Exception: Missing GEMINI_API_KEY parameter environment key.');
}

// Enter GoogleGenAI API KEY
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });