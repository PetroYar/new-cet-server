import mongoose from "mongoose";

const Comment = mongoose.Schema(
  {
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", Comment);
