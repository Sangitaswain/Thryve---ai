import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string) => {
  /**
   * IMPORTANT: The API key is obtained exclusively from the environment variable `process.env.API_KEY`.
   * No hardcoded keys are present in this source code to ensure security and best practices.
   */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Thryve AI, a professional, empathetic wellness and health coach. You help users build long-term healthy habits. Focus on evidence-based advice, nutrition, sleep, hydration, and mental well-being. Be concise and encouraging.",
        thinkingConfig: {
          thinkingBudget: 32768
        }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now. Let's try again in a moment.";
  }
};