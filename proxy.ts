import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/v1/chat")) {
        console.log("Proxy Triggered for:", request.nextUrl.pathname); // Check your terminal for this!

        if (request.method === "OPTIONS") {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*", // Use wildcard for testing ONLY
                },
            });
        }

        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "*");
        return response;
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*", // Only target the API for now to simplify
};