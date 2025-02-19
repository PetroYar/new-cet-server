import { Router } from "express";
import commentControler from "../controler/commentControler.js";
import { restMiddleware } from "../middleware/restMiddleware.js";
import { postMiddleware } from "../middleware/postMiddleware.js";

const commentRouter = Router();
commentRouter.post(
  "/",
  restMiddleware,
  
  commentControler.create
);
commentRouter.get("/", commentControler.getAll);
commentRouter.put("/:id", commentControler.update);
commentRouter.put("/like/:id",restMiddleware, commentControler.toggleLike);
commentRouter.delete("/:id", restMiddleware, commentControler.delete);




export default commentRouter;
