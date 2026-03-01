import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface PaginationOptions {
    defaultLimit?: number;
    maxLimit?: number;
}

export interface PaginationQuery {
    page: number;
    limit: number;
    skip: number;
}

export function parseInteger(
    value: string | null,
    fallback: number,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER
): number {
    const parsed = Number.parseInt(value ?? "", 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

export function parseFloatNumber(
    value: string | null,
    fallback: number,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER
): number {
    const parsed = Number.parseFloat(value ?? "");
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

export function parseBoolean(value: string | null): boolean {
    return value === "1" || value === "true";
}

export function parsePagination(
    searchParams: URLSearchParams,
    options: PaginationOptions = {}
): PaginationQuery {
    const defaultLimit = options.defaultLimit ?? 12;
    const maxLimit = options.maxLimit ?? 50;
    const page = parseInteger(searchParams.get("page"), 1, 1, 1000);
    const limit = parseInteger(searchParams.get("limit"), defaultLimit, 1, maxLimit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

export function cleanString(value: string | null): string | undefined {
    if (!value) return undefined;
    const cleaned = value.trim();
    return cleaned.length > 0 ? cleaned : undefined;
}

export function cleanStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => String(item).trim())
        .filter(Boolean);
}

export function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

export function respondOk<T>(data: T, status = 200, cacheControl?: string) {
    return NextResponse.json(data, {
        status,
        ...(cacheControl ? { headers: { "Cache-Control": cacheControl } } : {}),
    });
}

export function respondError(message: string, status = 400, details?: unknown) {
    return NextResponse.json(
        details ? { error: message, details } : { error: message },
        { status }
    );
}

export function handleRouteError(scope: string, error: unknown) {
    const logMessage = error instanceof Error ? error.message : String(error);
    console.error(`${scope}:`, logMessage, error);
    return respondError("Internal server error", 500);
}
