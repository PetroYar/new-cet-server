import Comment from "../models/Comment.js";

const commentControler = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;

      const { description, postId } = req.body;
      if (!description) {
        return res.status(400).json({ message: "No description" });
      }

      const comment = new Comment({ description, postId, userId });
      await comment.save();

      const populatedComment = await Comment.aggregate([
        { $match: { _id: comment._id } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ]);

      return res.status(200).json(populatedComment[0]);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "no comments" });
      }

      const hasLiked = comment.likesBy.includes(userId);

      if (hasLiked) {
        comment.likesBy = comment.likesBy.filter(
          (id) => id.toString() !== userId
        );
        comment.likes -= 1;
      } else {
        comment.likesBy.push(userId);
        comment.likes += 1;
      }

      await comment.save();
      res.json({ likes: comment.likes, likesBy: comment.likesBy });
    } catch (error) {
      res.status(500).json({ message: "Помилка сервера", error });
    }
  },
  update: async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;
    if (userId !== id) throw new Error("no autorize");

    try {
    } catch (error) {}
  },
  getAll: async (req, res) => {
    try {
      const { _limit = 10, _start = 0, _order = "desc" } = req.query;
      const limit = parseInt(_limit, 10);
      const start = parseInt(_start, 10);
      const sortOrder = _order === "desc" ? -1 : 1;
      const currentPage = Math.floor(start / limit) + 1;
      const result = await Comment.aggregate([
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            comments: [
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
      const totalComments = result[0].totalCount[0]?.count || 0;
      const comments = result[0].comments;
      const totalPages = Math.ceil(totalComments / limit);

      res.status(200).json({
        firstPage: 1,
        lastPage: totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        comments,
        _limit: limit,
        _start: start,
        _order: _order,
      });
    } catch (error) {
      return res.status(400).json({ message: "Error retrieving posts", error });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
      const deletedComments = await Comment.findByIdAndDelete(id);
      if (!deletedComments) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post", error });
    }
  },
};

export default commentControler;
