import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.DATA_ENCRYPTION_KEY!, "hex");

export function encrypt(text: string) {
    const iv = crypto.randomBytes(12); // 96-bit nonce (best for GCM)
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString("hex"),
        content: encrypted,
        tag: tag.toString("hex"),
    };
}

export function decrypt(enc: { iv: string; content: string; tag: string }) {
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        KEY,
        Buffer.from(enc.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(enc.tag, "hex"));

    let decrypted = decipher.update(enc.content, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
