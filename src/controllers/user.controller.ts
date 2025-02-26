import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

interface AutheticatedRequest extends Request {
	auth?: {
		userId?: string;
	}
}

export const getUserSavedPosts = async (req: AutheticatedRequest, res: Response, next: NextFunction) => {
	try {
		const clerkUserId = req.auth?.userId;

		if (!clerkUserId) {
			res.status(401).json("Not authenticated");
			return;
		}

		const user = await User.findOne({ clerkUserId });

		res.status(200).json(user?.savedPosts);
	}
	catch (err) {
		next(err);
	}
}

export const savePost = async (req: AutheticatedRequest, res: Response, next: NextFunction) => {
	try {
		const clerkUserId = req.auth?.userId;
		const postId = req.body.postId;

		if (!clerkUserId) {
			res.status(401).json("Not authenticated");
			return;
		}

		const user = await User.findOne({ clerkUserId });

		const isSaved = user?.savedPosts.some((p) => p === postId);

		if (!isSaved) {
			await User.findByIdAndUpdate(user?._id, {
				$push: { savedPosts: postId },
			});
		}
		else {
			await User.findByIdAndUpdate(user?._id, {
				$pull: { savedPosts: postId },
			});
		}

		res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
	}
	catch (err) {
		next(err);
	}
}