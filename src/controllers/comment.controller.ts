import { NextFunction, Request, Response } from "express";
import Comment from "../models/comment.model";
import User from "../models/user.model";

interface AuthenticatedRequest extends Request {
	auth?: { userId?: string, sessionClaims?: any, };
}

export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await Comment.find({ post: req.params.postId })
			.populate("user", "username img")
			.sort({ createdAt: -1 });

		res.json(comments);
	}
	catch (err) {
		next(err);
	}
}

export const addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const clerkUserId = req.auth?.userId;
		const postId = req.params.postId;

		if (!clerkUserId) {
			res.status(401).json("Not authenticated");
			return;
		}

		const user = await User.findOne({ clerkUserId });
		if (!user) {
			res.status(404).json("User not found");
			return;
		}

		const newComment = new Comment({
			...req.body,
			user: user._id,
			post: postId,
		});

		const savedComment = await newComment.save();

		setTimeout(() => {
			res.status(201).json(savedComment);
		}, 3000);
	}
	catch (err) {
		next(err);
	}
}

export const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const clerkUserId = req.auth?.userId;
		const commentId = req.params.id;

		if (!clerkUserId) {
			res.status(401).json("Not authenticated") 
			return;
		};

		const role = req.auth?.sessionClaims?.metadata?.role || "user"; // role = "admin" ou "user"		
		if (role === "admin") {
			await Comment.findByIdAndDelete(req.params.id);
			res.status(200).json({ message: "Comment has been deleted" });
			return;
		}

		const user = await User.findOne({ clerkUserId });
		if (!user) {
			res.status(404).json("User not found") 
			return;
		}

		const deletedComment = await Comment.findOneAndDelete({
			_id: commentId,
			user: user._id,
		});

		if (!deletedComment) {
			res.status(403).json("You can delete only your comment!");
			return;
		}

		res.status(200).json("Comment deleted");
	}
	catch (err) {
		next(err);
	}
}