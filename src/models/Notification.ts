import mongoose, { Document, Model, Schema } from "mongoose";

export type NotificationType =
    | "deal_expiring"
    | "new_comment"
    | "upvote_milestone"
    | "deal_verified";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: NotificationType;
    message: string;
    postId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        type: {
            type: String,
            required: true,
            enum: ["deal_expiring", "new_comment", "upvote_milestone", "deal_verified"],
            index: true,
        },
        message: { type: String, required: true, trim: true, maxlength: 240 },
        postId: { type: Schema.Types.ObjectId, ref: "Post" },
        isRead: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
