import Post from "../models/post.model";
import { Request, Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
	const posts = await Post.find();
	res.status(200).send(posts);
}

export const getPost = async (req: Request, res: Response) => {
	const post = await Post.findOne({ slug: req.params.slug });
	res.status(200).send(post);
}

export const createPost = async (req: Request, res: Response) => {
	const newPost = new Post(req.body);
	const post = await newPost.save();

	res.status(200).json({
		post: post,
		message: "Post has been created",
	});
}

export const deletePost = async (req: Request, res: Response) => {
	const postId = req.params.id;
	const post = await Post.findByIdAndDelete(req.params.id);

	res.status(200).json("Post has been deleted");
}