import mongoose, { Document, Model, Schema } from "mongoose";

export type PostType = "deal" | "food_spot" | "event" | "lost_found" | "service" | "alert";
export type PostStatus = "active" | "expired" | "removed";

interface DealData {
    platform: string;
    platformType: "ecommerce" | "quick_commerce";
    originalPrice: number;
    dealPrice: number;
    discountPercent: number;
    dealLink: string;
    category: string;
    expiresAt: Date;
    communityVerified: boolean;
    verifiedCount: number;
}

interface FoodData {
    placeName: string;
    dishName: string;
    dishCategory: string;
    priceRange: string;
    timing: string;
    isStreetStall: boolean;
    landmark: string;
    averageRating: number;
    ratingsCount: number;
}

interface PostLocation {
    city: string;
    area: string;
    fullAddress: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface IPost extends Document {
    type: PostType;
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    upvotes: number;
    upvotedBy: string[];
    commentsCount: number;
    savesCount: number;
    status: PostStatus;
    dealData?: DealData;
    foodData?: FoodData;
    location?: PostLocation;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const DealDataSchema = new Schema<DealData>(
    {
        platform: { type: String, default: "" },
        platformType: { type: String, enum: ["ecommerce", "quick_commerce"] },
        originalPrice: { type: Number, min: 0 },
        dealPrice: { type: Number, min: 0 },
        discountPercent: { type: Number, min: 0, max: 100 },
        dealLink: { type: String, default: "" },
        category: { type: String, default: "" },
        expiresAt: { type: Date },
        communityVerified: { type: Boolean, default: false },
        verifiedCount: { type: Number, default: 0, min: 0 },
    },
    { _id: false }
);

const FoodDataSchema = new Schema<FoodData>(
    {
        placeName: { type: String, default: "" },
        dishName: { type: String, default: "" },
        dishCategory: { type: String, default: "" },
        priceRange: { type: String, default: "" },
        timing: { type: String, default: "" },
        isStreetStall: { type: Boolean, default: false },
        landmark: { type: String, default: "" },
        averageRating: { type: Number, min: 0, max: 5, default: 0 },
        ratingsCount: { type: Number, min: 0, default: 0 },
    },
    { _id: false }
);

const LocationSchema = new Schema<PostLocation>(
    {
        city: { type: String, default: "", index: true },
        area: { type: String, default: "", index: true },
        fullAddress: { type: String, default: "" },
        coordinates: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 },
        },
    },
    { _id: false }
);

const PostSchema = new Schema<IPost>(
    {
        type: {
            type: String,
            required: true,
            enum: ["deal", "food_spot", "event", "lost_found", "service", "alert"],
            index: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        title: { type: String, required: true, index: true, trim: true },
        description: { type: String, default: "", trim: true },
        images: [{ type: String }],
        upvotes: { type: Number, default: 0, min: 0, index: true },
        upvotedBy: [{ type: String }],
        commentsCount: { type: Number, default: 0, min: 0 },
        savesCount: { type: Number, default: 0, min: 0 },
        status: { type: String, enum: ["active", "expired", "removed"], default: "active", index: true },
        dealData: { type: DealDataSchema },
        foodData: { type: FoodDataSchema },
        location: { type: LocationSchema },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

PostSchema.index({ title: "text", description: "text", tags: "text" });
PostSchema.index({ "location.city": 1, "location.area": 1, type: 1, createdAt: -1 });
PostSchema.index({ "dealData.platform": 1, type: 1, createdAt: -1 });
PostSchema.index({ "foodData.dishName": 1, type: 1, upvotes: -1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
