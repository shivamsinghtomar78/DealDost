import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFoodSpot extends Document {
    name: string;
    description: string;
    dishCategory: string;
    dishTags: string[];
    priceRange: { min: number; max: number };
    area: string;
    city: string;
    address: string;
    landmark: string;
    location: { type: string; coordinates: [number, number] }; // GeoJSON
    timing: string;
    isOpenNow: boolean;
    imageUrl: string;
    photos: string[];
    rating: number;
    ratingBreakdown: {
        taste: number;
        portion: number;
        value: number;
        hygiene: number;
    };
    totalRatings: number;
    beenHereCount: number;
    beenHereBy: string[];
    upvotes: number;
    upvotedBy: string[];
    postedBy: string;
    postedByUsername: string;
    spotType: "street_stall" | "restaurant" | "cafe" | "dhaba" | "cloud_kitchen";
    isVeg: boolean;
    tags: string[];
    reviewsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const FoodSpotSchema = new Schema<IFoodSpot>(
    {
        name: { type: String, required: true, index: true },
        description: { type: String, required: true },
        dishCategory: {
            type: String,
            required: true,
            enum: ["Momos", "Chole Bhature", "Biryani", "Butter Chicken", "Dosa", "Maggi", "Paratha", "Rolls", "Chaat", "Pizza", "Burger", "Ice Cream", "Thali", "Other"],
        },
        dishTags: [{ type: String }],
        priceRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
        },
        area: { type: String, required: true, index: true },
        city: { type: String, required: true, index: true },
        address: { type: String, required: true },
        landmark: { type: String },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [lng, lat]
        },
        timing: { type: String, required: true },
        isOpenNow: { type: Boolean, default: false },
        imageUrl: { type: String, required: true },
        photos: [{ type: String }],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        ratingBreakdown: {
            taste: { type: Number, default: 0 },
            portion: { type: Number, default: 0 },
            value: { type: Number, default: 0 },
            hygiene: { type: Number, default: 0 },
        },
        totalRatings: { type: Number, default: 0 },
        beenHereCount: { type: Number, default: 0 },
        beenHereBy: [{ type: String }],
        upvotes: { type: Number, default: 0 },
        upvotedBy: [{ type: String }],
        postedBy: { type: String, required: true, index: true },
        postedByUsername: { type: String, required: true },
        spotType: {
            type: String,
            enum: ["street_stall", "restaurant", "cafe", "dhaba", "cloud_kitchen"],
            default: "street_stall",
        },
        isVeg: { type: Boolean, default: false },
        tags: [{ type: String }],
        reviewsCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Geo index for "Near Me" queries
FoodSpotSchema.index({ location: "2dsphere" });
FoodSpotSchema.index({ name: "text", description: "text" });

const FoodSpot: Model<IFoodSpot> = mongoose.models.FoodSpot || mongoose.model<IFoodSpot>("FoodSpot", FoodSpotSchema);
export default FoodSpot;
