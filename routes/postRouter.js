import { Router } from "express";
import postControler from "../controler/postControler.js";
import { restMiddleware } from "../middleware/restMiddleware.js";

const postRouter = Router();

postRouter.post("/", restMiddleware, postControler.create);
postRouter.get("/", postControler.getAll);
postRouter.get("/:id", postControler.getOneAndComments);
postRouter.get("/post/:id", postControler.getOne);
postRouter.put("/like/:id", restMiddleware, postControler.toggleLike);

postRouter.put("/update/:id", restMiddleware, postControler.update);
postRouter.delete("/:id", restMiddleware, postControler.delete);
postRouter.get("/user/:id",  postControler.getUserPosts);



export default postRouter;
