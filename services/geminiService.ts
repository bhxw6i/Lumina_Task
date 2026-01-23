
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  suggestSubtasks: async (taskTitle: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I have a task called "${taskTitle}". Suggest 3-5 concise, actionable subtasks that would help me complete it.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subtasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["subtasks"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text.trim());
        return result.subtasks as string[];
      }
      return [];
    } catch (error) {
      console.error("AI suggestion error:", error);
      return ["Focus on high impact steps", "Break it down further", "Allocate time on calendar"];
    }
  }
};
