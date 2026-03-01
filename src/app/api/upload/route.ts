import { NextRequest } from "next/server";
import { z } from "zod";
import {
    handleRouteError,
    respondError,
    respondOk,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

const requestSchema = z.object({
    fileName: z.string().trim().min(1),
    contentType: z.string().trim().min(1),
    folder: z.string().trim().optional(),
});

// POST /api/upload
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const parsed = requestSchema.safeParse(payload);
        if (!parsed.success) {
            return respondError("Invalid payload", 400, parsed.error.flatten());
        }

        const { fileName, contentType, folder } = parsed.data;
        const uploadPath = `${folder ?? "uploads"}/${Date.now()}-${fileName}`;

        return respondOk({
            uploadPath,
            contentType,
            provider: "firebase_storage_client_upload",
            message:
                "Use Firebase client SDK to upload directly to this path, then store the public URL in your post.",
        });
    } catch (error) {
        return handleRouteError("POST /api/upload", error);
    }
}

// DELETE /api/upload
export async function DELETE() {
    return respondError(
        "Delete endpoint requires Firebase Admin integration. Add FIREBASE_ADMIN_PRIVATE_KEY and FIREBASE_ADMIN_CLIENT_EMAIL to enable server-side deletes.",
        501
    );
}
