import Post from "../models/Post.js";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
const postControler = {
  create: async (req, res) => {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;

      const post = new Post({
        title,
        description,
        userId,
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  },
  toggleLike: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "no comments" });
      }

      const hasLiked = post.likesBy.includes(userId);

      if (hasLiked) {
        post.likesBy = post.likesBy.filter((id) => id.toString() !== userId);
        post.likes -= 1;
      } else {
        post.likesBy.push(userId);
        post.likes += 1;
      }

      await post.save();
      res.json({ likes: post.likes, likesBy: post.likesBy });
    } catch (error) {
      res.status(500).json({ message: "error server", error });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const posts = await Post.find({ userId: id }).populate(
        "userId",
        "username"
      );

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const { _limit = 5, _start = 0, _order = "desc" } = req.query;
      const limit = parseInt(_limit, 10);
      const start = parseInt(_start, 10);
      const sortOrder = _order === "desc" ? -1 : 1;
      const currentPage = Math.floor(start / limit) + 1;
      const result = await Post.aggregate([
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            posts: [
              { $sort: { createdAt: sortOrder } },
              { $skip: start },
              { $limit: limit },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: "$user" },
            ],
          },
        },
      ]);
      const totalPosts = result[0].totalCount[0]?.count || 0;
      const posts = result[0].posts;
      const totalPages = Math.ceil(totalPosts / limit);

      res.status(200).json({
        firstPage: 1,
        lastPage: totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        posts,
        _limit: limit,
        _start: start,
        _order: _order,
      });
    } catch (error) {
      return res.status(400).json({ message: "Error retrieving posts", error });
    }
  },

  getOneAndComments: async (req, res) => {
    try {
      const { id } = req.params;
      const objectId = new mongoose.Types.ObjectId(id);

      const post = await Post.aggregate([
        {
          $match: { _id: objectId },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "comments",
          },
        },
        {
          $addFields: {
            comments: {
              $filter: {
                input: "$comments",
                as: "comment",
                cond: { $ne: ["$$comment", null] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "comments.user",
          },
        },
        {
          $unwind: {
            path: "$comments.user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            comments: {
              $cond: {
                if: { $eq: [{ $type: "$comments" }, "array"] },
                then: "$comments",
                else: [{ $ifNull: ["$comments", {}] }],
              },
            },
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            likesBy: 1,
            likes: 1,
            user: 1,
            comments: {
              $filter: {
                input: "$comments",
                as: "comment",
                cond: { $ne: ["$$comment", {}] },
              },
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      if (!post.length) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to get post" });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const objectId = new mongoose.Types.ObjectId(id);

      const post = await Post.aggregate([
        {
          $match: { _id: objectId },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ]);

      return res.status(200).json(post[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to get post" });
    }
  },

  update: async (req, res) => {
    try {
      // const { _id } = req.user;

      const { id } = req.params;
      const { title, description } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // if (id != _id) {
      //   return res.status(403).json({ message: "Not authorized" });
      // }

      post.title = title || post.title;
      post.description = description || post.description;
      await post.save();

      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
      await Comment.deleteMany({ postId: id });

      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post", error });
    }
  },
};

export default postControler;
