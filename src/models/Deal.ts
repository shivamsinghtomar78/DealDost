import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeal extends Document {
    title: string;
    description: string;
    platform: string;
    platformType: "ecommerce" | "quick_commerce";
    category: string;
    originalPrice: number;
    dealPrice: number;
    discountPercent: number;
    dealLink: string;
    imageUrl: string;
    expiresAt: Date;
    postedBy: string; // Firebase UID
    postedByUsername: string;
    upvotes: number;
    upvotedBy: string[];
    verifiedBy: string[];
    verifiedCount: number;
    commentsCount: number;
    isActive: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
    {
        title: { type: String, required: true, index: true },
        description: { type: String, required: true },
        platform: {
            type: String,
            required: true,
            enum: ["Amazon", "Flipkart", "Myntra", "Zepto", "Blinkit", "Instamart", "BigBasket", "Meesho", "Nykaa", "Ajio", "Other"],
        },
        platformType: {
            type: String,
            required: true,
            enum: ["ecommerce", "quick_commerce"],
        },
        category: {
            type: String,
            required: true,
            enum: ["Grocery", "Fashion", "Electronics", "Beauty", "Home", "Food", "Sports", "Books", "Other"],
        },
        originalPrice: { type: Number, required: true },
        dealPrice: { type: Number, required: true },
        discountPercent: { type: Number, required: true },
        dealLink: { type: String, required: true },
        imageUrl: { type: String, required: true },
        expiresAt: { type: Date, required: true, index: true },
        postedBy: { type: String, required: true, index: true },
        postedByUsername: { type: String, required: true },
        upvotes: { type: Number, default: 0 },
        upvotedBy: [{ type: String }],
        verifiedBy: [{ type: String }],
        verifiedCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

// Text search index
DealSchema.index({ title: "text", description: "text" });

const Deal: Model<IDeal> = mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema);
export default Deal;
