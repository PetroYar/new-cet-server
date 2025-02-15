import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRourer.js";
import postRouter from "./routes/postRouter.js";
import cors from 'cors'

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());



app.use("/api", authRouter);
app.use("/api/posts", postRouter);

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
