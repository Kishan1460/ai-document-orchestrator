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

    // Extract raw text 
    if (req.file.mimetype === 'application/pdf') {
      
      // Initialize the parser instance 
      const parser = new PDFParse({ data: req.file.buffer });
      
      //  Extract the text using the async class method
      const result = await parser.getText();
      documentText = result.text;
      
      await parser.destroy(); 
      
    } else {
      documentText = req.file.buffer.toString('utf-8');
    }

    if (!documentText.trim()) {
      return res.status(422).json({ error: 'Inability to extract characters from target payload asset.' });
    }

    //  Push text to Gemini
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

    res.json({
      extractedPairs: parsedJsonResult.extracted_pairs,
      rawTextContext: documentText
    });

  } catch (error) {
    next(error);
  }
};
