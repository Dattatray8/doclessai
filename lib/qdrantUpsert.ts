import {qdrantClient} from "@/lib/qdrant";

export async function upsertFeatureVector({featureId, embedding, payload} : {featureId: string, embedding: number[], payload: Record<string, unknown>}) {
    await qdrantClient.upsert(process.env.QDRANT_COLLECTION!, {
        points: [
            {
                id: featureId,
                vector: embedding,
                payload,
            },
        ],
    });
}