import {GoogleGenerativeAI} from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
}

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const embmodel = genAi.getGenerativeModel({
    model: "text-embedding-004",
});

export const generateEmbeddings = async (text: string) => {
    const res = await embmodel.embedContent(text.trim().replace(/\s+/g, " "));
    return res.embedding.values;
};

