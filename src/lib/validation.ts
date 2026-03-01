import { z } from "zod";

const priceSchema = z
    .number()
    .finite()
    .nonnegative();

const nonEmptyString = z
    .string()
    .trim()
    .min(1);

export const dealCreateSchema = z
    .object({
        title: nonEmptyString.max(180),
        description: nonEmptyString.max(2000),
        platform: nonEmptyString.max(50),
        platformType: z.enum(["ecommerce", "quick_commerce"]),
        category: nonEmptyString.max(80),
        originalPrice: priceSchema,
        dealPrice: priceSchema,
        dealLink: z.string().trim().url(),
        imageUrl: z.string().trim().url(),
        expiresAt: z.coerce.date(),
        postedBy: nonEmptyString.max(100),
        postedByUsername: nonEmptyString.max(100),
        tags: z.array(nonEmptyString.max(50)).max(20).optional(),
        isActive: z.boolean().optional(),
    })
    .refine((data) => data.dealPrice <= data.originalPrice, {
        message: "Deal price must be less than or equal to original price",
        path: ["dealPrice"],
    });

export const dealUpdateSchema = z
    .object({
        title: nonEmptyString.max(180).optional(),
        description: nonEmptyString.max(2000).optional(),
        platform: nonEmptyString.max(50).optional(),
        platformType: z.enum(["ecommerce", "quick_commerce"]).optional(),
        category: nonEmptyString.max(80).optional(),
        originalPrice: priceSchema.optional(),
        dealPrice: priceSchema.optional(),
        dealLink: z.string().trim().url().optional(),
        imageUrl: z.string().trim().url().optional(),
        expiresAt: z.coerce.date().optional(),
        tags: z.array(nonEmptyString.max(50)).max(20).optional(),
        isActive: z.boolean().optional(),
    })
    .refine(
        (data) => {
            if (data.originalPrice === undefined || data.dealPrice === undefined) return true;
            return data.dealPrice <= data.originalPrice;
        },
        {
            message: "Deal price must be less than or equal to original price",
            path: ["dealPrice"],
        }
    );

export const dealActionSchema = z.object({
    action: z.enum(["upvote", "verify"]),
    userId: nonEmptyString.max(100),
});

export const foodSpotCreateSchema = z.object({
    name: nonEmptyString.max(180),
    description: nonEmptyString.max(2000),
    dishCategory: nonEmptyString.max(80),
    dishTags: z.array(nonEmptyString.max(50)).max(20).optional(),
    priceRange: z.object({
        min: priceSchema,
        max: priceSchema,
    }),
    area: nonEmptyString.max(100),
    city: nonEmptyString.max(100),
    address: nonEmptyString.max(400),
    landmark: z.string().trim().max(200).optional(),
    location: z.object({
        type: z.literal("Point").default("Point"),
        coordinates: z
            .array(z.number().finite())
            .length(2),
    }),
    timing: nonEmptyString.max(100),
    isOpenNow: z.boolean().optional(),
    imageUrl: z.string().trim().url(),
    photos: z.array(z.string().trim().url()).max(20).optional(),
    rating: z.number().min(0).max(5).optional(),
    postedBy: nonEmptyString.max(100),
    postedByUsername: nonEmptyString.max(100),
    spotType: z
        .enum(["street_stall", "restaurant", "cafe", "dhaba", "cloud_kitchen"])
        .optional(),
    isVeg: z.boolean().optional(),
    tags: z.array(nonEmptyString.max(50)).max(20).optional(),
}).refine((data) => data.priceRange.max >= data.priceRange.min, {
    message: "priceRange.max must be greater than or equal to priceRange.min",
    path: ["priceRange", "max"],
});

export const foodSpotUpdateSchema = z.object({
    name: nonEmptyString.max(180).optional(),
    description: nonEmptyString.max(2000).optional(),
    dishCategory: nonEmptyString.max(80).optional(),
    dishTags: z.array(nonEmptyString.max(50)).max(20).optional(),
    priceRange: z
        .object({
            min: priceSchema,
            max: priceSchema,
        })
        .optional(),
    area: nonEmptyString.max(100).optional(),
    city: nonEmptyString.max(100).optional(),
    address: nonEmptyString.max(400).optional(),
    landmark: z.string().trim().max(200).optional(),
    timing: nonEmptyString.max(100).optional(),
    isOpenNow: z.boolean().optional(),
    imageUrl: z.string().trim().url().optional(),
    photos: z.array(z.string().trim().url()).max(20).optional(),
    rating: z.number().min(0).max(5).optional(),
    tags: z.array(nonEmptyString.max(50)).max(20).optional(),
    spotType: z
        .enum(["street_stall", "restaurant", "cafe", "dhaba", "cloud_kitchen"])
        .optional(),
    isVeg: z.boolean().optional(),
});

export const foodSpotActionSchema = z.object({
    action: z.enum(["upvote", "been_here"]),
    userId: nonEmptyString.max(100),
});

export const eventCreateSchema = z.object({
    title: nonEmptyString.max(180),
    description: nonEmptyString.max(2000),
    eventType: z.enum(["event", "lost_found", "service", "alert"]),
    date: nonEmptyString.max(100),
    time: nonEmptyString.max(100),
    venue: nonEmptyString.max(220),
    area: nonEmptyString.max(120),
    city: nonEmptyString.max(120),
    imageUrl: z.string().trim().url(),
    entryFee: z.string().trim().max(120).optional(),
    postedBy: nonEmptyString.max(100),
    postedByUsername: nonEmptyString.max(100),
    tags: z.array(nonEmptyString.max(50)).max(20).optional(),
});

export const userUpsertSchema = z.object({
    firebaseUid: nonEmptyString.max(128),
    name: nonEmptyString.max(120),
    email: z.string().trim().email(),
    avatarUrl: z.string().trim().url().or(z.literal("")).optional(),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9_]+$/)
        .max(40)
        .optional(),
});
