import Post from "../models/Post.js";

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

  getAll: async (req, res) => {
    try {
      const { _limit = 10, _start = 0, _order = "desc" } = req.query;
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

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const post = await Post.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(id) }, // Фільтрація за ID
        },
        {
          $lookup: {
            from: "users", // З'єднуємо з колекцією users
            localField: "userId", // Поле в Post, яке містить ID користувача
            foreignField: "_id", // Поле в users, яке містить ID
            as: "user", // Нове поле, яке міститиме дані користувача
          },
        },
        {
          $unwind: "$user", // Якщо користувач знайдений, "розгортаємо" його
        },
      ]);

      if (post.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json(post[0]); // Відповідь з першим постом, оскільки це масив
    } catch (error) {
      return res.status(400).json({ message: "Error retrieving post", error });
    }
  },
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const post = await Post.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(id) }, 
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

      if (post.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json(post[0]);
    } catch (error) {
      return res.status(400).json({ message: "Error retrieving post", error });
    }
  },
  update: async (req, res) => {
    try {
    } catch (error) {}
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
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
