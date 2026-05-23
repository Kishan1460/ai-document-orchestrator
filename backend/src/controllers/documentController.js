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

    // Extract raw text from incoming memory stream buffer
    if (req.file.mimetype === 'application/pdf') {
      
      // Initialize the parser instance by passing a data object
      const parser = new PDFParse({ data: req.file.buffer });
      
      //  Extract the text using the async class method
      const result = await parser.getText();
      documentText = result.text;
      
      //  IAlways destroy the worker pool to prevent Node memory leaks
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
        
        CRITICAL FALLBACK DIRECTION FOR MISSING INFORMATION:
        If the analysis query ("${query}") looks for personal information, status metrics, or data attributes that are 
        completely absent or not explicitly mentioned anywhere in the document (such as marital status, family tracking, 
        or unlisted hobbies), ignore the "5 to 8 items" rule. 
        Instead, return exactly ONE object element inside the extracted_pairs array where the key is the topic requested 
        and the value is explicitly: "No information found in the document regarding this query."
        
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
                  key: { 
                    type: Type.STRING, 
                    description: "Normalized parameter title block name identifier (e.g., 'Marital Status' or requested trait)." 
                  },
                  value: { 
                    type: Type.STRING, 
                    description: "Extracted target summary metadata evaluation. Set to 'No information found in the document regarding this query.' if data is missing." 
                  }
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
