import {qdrantClient} from "@/lib/qdrant";

export async function ensureQdrantCollection() {
    const collectionName = process.env.QDRANT_COLLECTION!;

    const collections = await qdrantClient.getCollections();
    const exists = collections.collections?.some(
        (c) => c.name === collectionName
    );

    if (exists) {
        console.log("Qdrant collection already exists:", collectionName);
        return;
    }

    await qdrantClient.createCollection(collectionName, {
        vectors: {
            size: 768,
            distance: "Cosine",
        },
    });

    console.log("Created Qdrant collection:", collectionName);
}