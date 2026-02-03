import {qdrantClient} from "@/lib/qdrant";

export async function searchSimilarFeatures(embedding: number[]) {
    const result = await qdrantClient.search(
        process.env.QDRANT_COLLECTION!,
        {
            vector: embedding,
            limit: 5,
        }
    );

    return result;
}
