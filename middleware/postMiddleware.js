import jwt from "jsonwebtoken";

export const postMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає доступу, потрібен токен" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Невірний або прострочений токен" });
    }

    req.user = decoded; // Додаємо інформацію про користувача в запит
    next();
  });
};
