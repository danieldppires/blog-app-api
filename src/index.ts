import './config/env';
import express from "express";
import connectDB from './lib/connectDB';
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import commentRouter from "./routes/comment.route";

const app = express();
const port = process.env.PORT;

// MIDDLEWARES
app.use(express.json());

// ROTAS
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(port, () => {
	connectDB();
	console.log(`SERVER RUNNING ON PORT ${port}`);
});