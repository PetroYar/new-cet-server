import { Router } from "express";
import authControler from "../controler/authControler.js";
import { check } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
const authRouter = Router();

authRouter.post(
  "/auth/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password must be between 6 and 12 characters").isLength({
      min: 6,
      max: 12,
    }),
    check("email", "Please enter a valid email address").isEmail(),
  ],
  authControler.registration
);
authRouter.post("/auth/login", authControler.login);
authRouter.get("/user", authMiddleware, authControler.getUser);

export default authRouter;
