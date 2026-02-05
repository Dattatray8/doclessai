import {qdrantClient} from "@/lib/qdrant";

export async function searchSimilarFeatures(embedding: number[], appId: string) {
    await qdrantClient.createPayloadIndex(process.env.QDRANT_COLLECTION!, {
        field_name: "appId",
        field_schema: "keyword",
    });
    const result = await qdrantClient.search(
        process.env.QDRANT_COLLECTION!,
        {
            vector: embedding,
            limit: 5,
            filter: {
                must: [
                    {
                        key: "appId",
                        match: {value: appId}
                    }
                ]
            }
        }
    );

    return result;
}
