import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment, Urgency, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface RawData {
  text: string;
  url: string;
}

export const analyzeComments = async (
  items: RawData[], 
  source: Source,
  query: string
): Promise<AnalysisResult[]> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  if (items.length === 0) return [];

  const model = "gemini-3-flash-preview";
  const textsOnly = items.map(i => i.text);
  
  const prompt = `
    You are a professional Consumer Complaint Analyst and Social Listening Specialist.
    
    STRICT OBJECTIVE: Analyze the provided list of user comments/posts from ${source} specifically regarding the topic: "${query}".
    
    CRITICAL FILTERING RULES:
    1. TOPIC RELEVANCE: ONLY include items that are DIRECTLY related to "${query}". If a comment is about a different bank, a different service, or a general unrelated rant, DISCARD IT COMPLETELY. Do not return any JSON for irrelevant items.
    2. REAL COMPLAINTS: Prioritize specific, real-world grievances (e.g., "I lost money", "The app crashed during UPI", "Staff was rude at the branch").
    3. LANGUAGE: Translate regional languages (Hindi, Hinglish, etc.) into professional, clean English.
    4. NO SYMBOLS: Remove all emojis and special characters. Use only standard ASCII (A-Z, 0-9).
    5. ANALYSIS: Provide a clear rationale for why this is a complaint/feedback related to "${query}".

    JSON SCHEMA OUTPUT (Return an array):
    - originalText: THE FULL TRANSLATED ENGLISH VERSION.
    - sentiment: "Positive", "Negative", or "Neutral".
    - category: Specific issue type (e.g., UPI, Customer Care, Fees, Staff Behavior).
    - urgency: "High", "Medium", or "Low".
    - location: Specific Indian city/state if mentioned, otherwise "India".
    - explanation: A professional 1-sentence analytical rationale.

    INPUT DATA:
    ${JSON.stringify(textsOnly)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalText: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: [Sentiment.Positive, Sentiment.Negative, Sentiment.Neutral] },
              category: { type: Type.STRING },
              urgency: { type: Type.STRING, enum: [Urgency.High, Urgency.Medium, Urgency.Low] },
              location: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["originalText", "sentiment", "category", "urgency", "explanation", "location"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsedData = JSON.parse(jsonText) as Omit<AnalysisResult, 'id' | 'source' | 'url'>[];
    
    // We attempt to map back URLs based on the original index if possible, 
    // but since the AI might discard items, we'll use a best-effort approach or just map remaining ones.
    // To be safe, we'll try to find the closest match or just return results.
    return parsedData.map((item, index) => {
      // Find original item index by checking if text is similar (basic check)
      const originalItem = items.find(i => i.text.toLowerCase().includes(item.category.toLowerCase()) || i.text.length > 50);

      return {
        ...item,
        id: `analysis-${Date.now()}-${index}`,
        source: source,
        url: originalItem?.url || items[0]?.url, // Fallback to first URL if mapping fails
        originalText: (item.originalText || "").replace(/[^\x20-\x7E]/g, '').trim(),
        explanation: (item.explanation || "").replace(/[^\x20-\x7E]/g, '').trim(),
        location: (item.location || "India").replace(/[^\x20-\x7E]/g, '').trim()
      };
    });

  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
};