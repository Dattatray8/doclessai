import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateAppKey(): string {
    const random = crypto.randomBytes(32).toString("hex");
    return `doclessai_live_${random}`;
}

export async function hashAppKey(appKey: string): Promise<string> {
    return await bcrypt.hash(appKey, 12);
}

export async function verifyAppKey(appKey: string, appSecret: string): Promise<boolean> {
    return await bcrypt.compare(appKey, appSecret);
}