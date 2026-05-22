// 1. Change to the official v2.5 named class import structure
import { PDFParse } from 'pdf-parse'; 
import { Type } from '@google/genai';
import { ai } from '../config/gemini.js';

export const processDocument = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Target parsing file parameter not supplied.' });
    if (!query) return res.status(400).json({ error: 'Target contextual query mapping criteria not supplied.' });

    let documentText = '';

    // Step A: Extract raw text from incoming memory stream buffer
    if (req.file.mimetype === 'application/pdf') {
      
      // 2. Initialize the parser instance by passing a data object
      const parser = new PDFParse({ data: req.file.buffer });
      
      // 3. Extract the text using the async class method
      const result = await parser.getText();
      documentText = result.text;
      
      // 4. IMPORTANT: Always destroy the worker pool to prevent Node memory leaks
      await parser.destroy(); 
      
    } else {
      documentText = req.file.buffer.toString('utf-8');
    }

    if (!documentText.trim()) {
      return res.status(422).json({ error: 'Inability to extract characters from target payload asset.' });
    }

    // Step B: Push to Gemini utilizing strict schema model structure validation mapping
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the provided document details. Isolate and compile exactly 5 to 8 primary objective features, conditions, 
        status points or entity metrics that specifically fulfill the target parameters inside this analysis query: "${query}".
        
        Raw Document Content Block:
        ${documentText}
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extracted_pairs: {
              type: Type.ARRAY,
              description: "Extracted structural token value pairings matching structural criteria elements requested.",
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING, description: "Normalized parameter title block name identifier." },
                  value: { type: Type.STRING, description: "Extracted target summary metadata evaluation." }
                },
                required: ["key", "value"]
              }
            }
          },
          required: ["extracted_pairs"]
        }
      }
    });

    const parsedJsonResult = JSON.parse(response.text);

    // Step C: Distribute data back down to client layers
    res.json({
      extractedPairs: parsedJsonResult.extracted_pairs,
      rawTextContext: documentText
    });

  } catch (error) {
    next(error);
  }
};
