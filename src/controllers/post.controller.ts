import Post from "../models/post.model";
import { NextFunction, Request, Response } from "express";

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = await Post.find();
		res.status(200).send(posts);
	}
	catch (err) {
		next(err); // Encaminhando o erro para o middleware de erro
	}
}

export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const post = await Post.findOne({ slug: req.params.slug });

		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		res.status(200).send(post);
	} 
	catch (err) {
		next(err);
	}
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newPost = new Post(req.body);
		const post = await newPost.save();

		res.status(201).json({
			post,
			message: "Post has been created",
		});
	} 
	catch (err) {
		next(err);
	}
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id);

		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		res.status(200).json({ message: "Post has been deleted" });
	} 
	catch (err) {
		next(err);
	}
};

// export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
// 			new: true, // Retorna o post atualizado
// 			runValidators: true, // Garante que as validações do schema sejam aplicadas
// 		});

// 		if (!post) {
// 			res.status(404).json({ message: "Post not found" });
// 			return;
// 		}

// 		res.status(200).json({ 
// 			post,
// 			message: "Post has been updated" 
// 		});
// 	}
// 	catch (err) {
// 		next(err);
// 	}
// };