
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import base64 from 'react-native-base64';
import Constants from 'expo-constants';

// Standard Base64 helpers for React Native
export const btoa = (input: string = '') => {
  return base64.encode(input);
};

export const atob = (input: string = '') => {
  return base64.decode(input);
};

const getAI = () => {
  const apiKey = Constants.expoConfig?.extra?.apiKey || '';
  return new GoogleGenAI({ apiKey });
};

/**
 * Streaming Chat Session Helper
 */
export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Thryve AI Coach, an expert in preventive health, longevity, and circadian biology. Provide actionable, empathetic, and scientifically-grounded advice. Keep responses conversational and supportive. If discussing nutrition, focus on glycemic load and nutrient density.",
    }
  });
};

/**
 * Text Generation (Non-streaming)
 */
export const getGeminiResponse = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        systemInstruction: "You are Thryve AI, a world-class preventive healthcare coach.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

/**
 * Meal Analysis Helper
 */
export const analyzeMealImage = async (base64Image: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: "Identify the food. Provide protein, carbs, fats, and a health rating (1-10). Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            protein: { type: Type.STRING },
            carbs: { type: Type.STRING },
            fats: { type: Type.STRING },
            healthRating: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["foodName", "protein", "carbs", "fats", "healthRating", "summary"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const searchHealthResearch = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest research on: ${query}`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return null;
  }
};

export const generateDailyStrategy = async (metrics: any) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Context: ${JSON.stringify(metrics)}. Provide 3 strategic wellness bullet points.`,
    });
    return response.text;
  } catch (e) {
    return "Stay consistent with your hydration goals today.";
  }
};
