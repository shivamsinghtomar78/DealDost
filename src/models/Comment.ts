import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    parentCommentId?: mongoose.Types.ObjectId | null;
    text: string;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
        text: { type: String, required: true, trim: true, maxlength: 1200 },
        upvotes: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
