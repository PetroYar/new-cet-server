import { Router } from "express";
import postControler from "../controler/postControler.js";
import { restMiddleware } from "../middleware/restMiddleware.js";

const postRouter = Router();

postRouter.post("/", restMiddleware, postControler.create);
postRouter.get("/", postControler.getAll);
postRouter.get("/:id", postControler.getOne);
postRouter.put("/:id", restMiddleware, postControler.update);
postRouter.delete("/:id", restMiddleware, postControler.delete);

export default postRouter;
