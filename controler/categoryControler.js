import Category from "../models/Category.js";

const categoryControler = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      if (categories.length === 0) {
        return res.status(400).json({ message: "No categories found" });
      }
      if (!categories) {
        return res.status(400).json({ message: "not categories" });
      }
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ message: "error server", error });
    }
  },
  create: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      const category = new Category({ name });
      await category.save();

      return res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  },
};

export default categoryControler;
