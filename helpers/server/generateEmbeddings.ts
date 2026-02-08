import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
}

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export const generateEmbeddings = async (text: string) => {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text.trim().replace(/\s+/g, " "),
        config: {
            outputDimensionality: 768,
            taskType: 'RETRIEVAL_QUERY' // Added for better RAG accuracy
        },
    });
    return response.embeddings![0].values;
};