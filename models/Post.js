import mongoose from "mongoose";

const Post = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", Post);
