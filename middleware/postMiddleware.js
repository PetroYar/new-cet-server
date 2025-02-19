import Post from "../models/Post.js";

export const postMiddleware = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Шукаємо пост за ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Якщо коментар створюється, додаємо ID поста до коментаря
    if (req.body.comment) {
      req.body.comment.postId = postId; // додаємо ID поста до коментаря
    }

    req.post = post; 
    next();
  } catch (error) {
    res.status(500).json({ message: "Error finding post", error });
  }
};
