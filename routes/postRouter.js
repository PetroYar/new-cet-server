import { Router } from "express";
import postControler from "../controler/postControler.js";

const postRouter = Router();

postRouter.post("/",postControler.create);
postRouter.get("/", postControler.getAll);
postRouter.get("/:id",postControler.getOne);
postRouter.get("/count",postControler.count);
postRouter.put("/:id",postControler.update);
postRouter.delete("/:id",postControler.delete);

export default postRouter;
