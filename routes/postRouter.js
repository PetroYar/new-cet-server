import { Router } from "express";
import postControler from "../controler/postControler.js";
import { postMiddleware } from "../middleware/postMiddleware.js";

const postRouter = Router();

postRouter.post("/",postMiddleware, postControler.create);
postRouter.get("/", postControler.getAll);
postRouter.get("/:id",postControler.getOne);
postRouter.put("/:id", postMiddleware, postControler.update);
postRouter.delete("/:id", postMiddleware, postControler.delete);

export default postRouter;
