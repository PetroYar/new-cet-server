import { Router } from "express";
import categoryControler from "../controler/categoryControler.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryControler.getAll);
categoryRouter.post("/", categoryControler.create);


export default categoryRouter;
