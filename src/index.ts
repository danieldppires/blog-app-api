import './config/env';
import express, { NextFunction, Request, Response } from "express";
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

// ERROR HANDLING
app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
	res.status(error.status || 500);

	res.json({
		message: error.message || "Something went wrong!",
		status: error.status,
		stack: process.env.NODE_ENV === "production" ? undefined : error.stack, // Ocultar stack em produção
	});
});

app.listen(port, () => {
	connectDB();
	console.log(`SERVER RUNNING ON PORT ${port}`);
});