import { NextFunction, Request, Response } from "express";
import Post from "../models/post.model";

const increaseVisit = async (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params.slug;

	await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1} });

	next();
}

export default increaseVisit;