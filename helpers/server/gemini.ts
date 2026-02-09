import {GoogleGenAI} from "@google/genai";

async function fileToBase64(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
}

interface Feature {
    name: string;
    description: string;
    route: string;
    image: string;
    elementId: string;
}

interface AppProfile {
    name: string;
    contactEmail: string;
    description: string;
}

export const generateResponse = async (
    app: AppProfile,
    geminiKey: string,
    query: string,
    features: Feature[],
    imageFile: File | null
) => {
    const genAi = new GoogleGenAI({apiKey: geminiKey});
    const parts = [];

    parts.push({
        text: `
# Role
You are the Intelligent Support Agent for ${app.name}. 
Your goal is to assist users by analyzing documentation and visual data to provide accurate, helpful guidance.

# Application Profile
- Name: ${app.name}
- Contact Email: ${app.contactEmail}
- Description: ${app.description}

# Context Data (Features / Docs)
${features.map(f => `
FEATURE:
Name: ${f.name}
Description: ${f.description}
Route: ${f.route}
ElementId: ${f.elementId}
Image: ${f.image}
`).join("\n")}

# User Input
User Query: ${query || "User sent an image without text."}

# Multimodal Reasoning Rules

1) If a user image is provided:
   - Treat it as a screenshot or real-world image.
   - Understand what the image shows.
   - Compare it with the provided feature reference images.
   - Identify the most relevant feature.
   - Select ONE best-matching image URL from the context.
   - Use that image URL in the JSON response.

2) If NO user image is provided:
   - Use text + context data only.
   - Do NOT guess images.
   - Set "image": null unless the query clearly maps to a feature image.

3) Image selection rules:
   - Only return image URLs that exist in the provided context.
   - Never invent image URLs.
   - If confidence is low → return "image": null.

4) Data grounding:
   - Use ONLY provided context.
   - No assumptions.
   - No hallucinations.
   - No external knowledge.

5) Answering style:
   - Clear
   - Professional
   - Helpful
   - Structured
   - Practical
   - Human-readable
   - No marketing language

6) If information is missing in context:
   Respond with:
   "I don’t have enough information about this in the current system data. Please contact ${app.contactEmail} for further support."

# Output Format (JSON ONLY)
{
  "res": "Clear, structured, helpful and detailed response",
  "image": "URL from context or null",
  "elementId": "ID from context or null",
  "route": "route from context or null"
}
`
    });

    if (imageFile) {
        const base64 = await fileToBase64(imageFile);

        parts.push({
            inlineData: {
                mimeType: imageFile.type,
                data: base64,
            },
        });
    }
    const featureImages = features
        .map(f => f.image)
        .filter(Boolean)
        .slice(0, 2);
    for (const url of featureImages) {
        parts.push({
            fileData: {
                mimeType: "image/png",
                fileUri: url
            }
        });
    }
    const res = await genAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{role: "user", parts}]
    });

    return JSON.parse(
        res.text!.replace(/```json/g, "").replace(/```/g, "").trim()
    );
};
