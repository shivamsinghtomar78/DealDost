import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    area: string;
    city: string;
    postsCount: number;
    totalUpvotes: number;
    totalSaved: number;
    savedDeals: string[];
    savedFoodSpots: string[];
    upvotedPosts: string[];
    badges: string[];
    karmaPoints: number;
    rank: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firebaseUid: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true },
        avatarUrl: { type: String, default: "" },
        area: { type: String, default: "" },
        city: { type: String, default: "" },
        postsCount: { type: Number, default: 0 },
        totalUpvotes: { type: Number, default: 0 },
        totalSaved: { type: Number, default: 0 },
        savedDeals: [{ type: String }],
        savedFoodSpots: [{ type: String }],
        upvotedPosts: [{ type: String }],
        badges: [{ type: String }],
        karmaPoints: { type: Number, default: 0 },
        rank: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
