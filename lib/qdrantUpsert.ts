import {qdrantClient} from "@/lib/qdrant";

export async function upsertFeatureVector({pointId, embedding, payload,}: {
    pointId: string;
    embedding: number[];
    payload: Record<string, unknown>;
}) {
    await qdrantClient.upsert(process.env.QDRANT_COLLECTION!, {
        points: [
            {
                id: pointId,
                vector: embedding,
                payload,
            },
        ],
    });
}
