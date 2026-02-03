import { ensureQdrantCollection } from "@/lib/qdrantSetup";

let qdrantReady:boolean = false;

export async function ensureQdrantReady() {
    if (qdrantReady) return;

    await ensureQdrantCollection();
    qdrantReady = true;
}
