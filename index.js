import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRourer.js";
import postRouter from "./routes/postRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import commentRouter from "./routes/commentRouter.js";
import categoryRouter from "./routes/categoryRouter.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/categories", categoryRouter);

const startApp = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.eaami.mongodb.net/`
    );
    app.listen(5000, () => {
      console.log("server ok");
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
