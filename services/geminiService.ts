
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Insight, AgentStatus, TutorialModule } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async orchestrateReasoning(objective: string, context: string): Promise<GenerateContentResponse> {
    // Uses Search Grounding to ensure autonomous insights are real-world aware
    return await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `System Objective: ${objective}\n\nCurrent Context: ${context}`,
      config: {
        systemInstruction: `You are AIN (Abythral Insight Network). Analyze inputs for CAUSAL links. 
        Focus on 'Marathon Agent' strategy: long-term stability and recursive correction. 
        Always assess risks and confidence (0-1). Use the provided search tools to verify current global trends.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
  }

  async verifyCode(code: string): Promise<{ status: 'PASS' | 'FAIL'; logs: string[] }> {
    // High-reasoning model for specialized logic verification
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Verify this system logic: \n${code}\n\nPerform a 'Vibe Check' for logical consistency and security.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['PASS', 'FAIL'] },
            logs: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['status', 'logs']
        },
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return JSON.parse(response.text || "{}");
  }

  async generateTutorial(context: string): Promise<TutorialModule> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the causal reasoning for: ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ['title', 'steps', 'summary']
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }

  async parseInsight(text: string): Promise<Insight> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this reasoning as a Strategic Insight JSON: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            causalityScore: { type: Type.NUMBER },
            recommendation: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }
          },
          required: ['title', 'content', 'causalityScore', 'recommendation', 'riskLevel']
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return { id: Math.random().toString(36).substr(2, 9), ...parsed, evidence: [] };
  }

  async generateVisualSimulation(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A highly detailed holographic data visualization of: ${prompt}. Cinematic sci-fi dashboard style.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "";
  }

  // Live session management is handled directly in App.tsx via SDK connect
}

export const geminiService = new GeminiService();
