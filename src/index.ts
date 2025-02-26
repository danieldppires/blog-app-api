import './config/env';
import express, { NextFunction, Request, Response } from "express";
import connectDB from './lib/connectDB';
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import commentRouter from "./routes/comment.route";
import webhookRouter from "./routes/webhook.route";
import authRouter from "./routes/auth.route";
import { clerkMiddleware, requireAuth } from '@clerk/express';
import cors from "cors";

const app = express();
const port = process.env.PORT;

// MIDDLEWARES
app.use(cors({ origin: process.env.CLIENT_URL })); // Se precisar de cookies, adicionar 'credentials: true'
app.use(clerkMiddleware());
app.use("/webhooks", webhookRouter); // Antes do middleware json para não conflitar pois este usa bodyParser
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-Width, Content-Type, Accept"
	);
	next();
});

// app.get("/auth-state", (req: Request | any, res: Response) => {
// 	const authState = req.auth;
// 	res.json(authState);
// });

// app.get("/protect", (req: any, res: any) => {
// 	const { userId } = req.auth;
// 	if (!userId)
// 		return res.status(401).json("Not authenticated");

// 	res.status(200).json("content");
// });

// app.get("/protect2", requireAuth(), (req: any, res: any) => {
// 	res.status(200).json("content");
// });

// ROTAS
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);

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