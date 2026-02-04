import {ensureQdrantCollection} from "@/lib/qdrantSetup";

export async function ensureQdrantReady() {
    await ensureQdrantCollection();
}
