import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    eventType: "event" | "lost_found" | "service" | "alert";
    date: string;
    time: string;
    venue: string;
    area: string;
    city: string;
    imageUrl: string;
    entryFee: string;
    interestedCount: number;
    interestedBy: string[];
    upvotes: number;
    upvotedBy: string[];
    postedBy: string;
    postedByUsername: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, index: true },
        description: { type: String, required: true },
        eventType: {
            type: String,
            required: true,
            enum: ["event", "lost_found", "service", "alert"],
        },
        date: { type: String, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        area: { type: String, required: true, index: true },
        city: { type: String, required: true, index: true },
        imageUrl: { type: String, required: true },
        entryFee: { type: String, default: "Free" },
        interestedCount: { type: Number, default: 0 },
        interestedBy: [{ type: String }],
        upvotes: { type: Number, default: 0 },
        upvotedBy: [{ type: String }],
        postedBy: { type: String, required: true },
        postedByUsername: { type: String, required: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

EventSchema.index({ title: "text", description: "text" });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
