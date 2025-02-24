import Post from "../models/post.model";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import ImageKit from "imagekit";

interface AuthenticatedRequest extends Request {
	auth?: { userId?: string };
}

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

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const clerkUserId = req.auth?.userId;
		if (!clerkUserId) {
			res.status(401).json({ message: "Not authenticated" }); return;
		}

		const user = await User.findOne({ clerkUserId });
		if (!user) {
			res.status(404).json({ message: "User not found" }); return;
		}

		// Criando slug dinamicamente
		let title = req.body.title as string;
		let baseSlug = title.replace(/ /g, "-").toLowerCase();
		let slug = baseSlug;

		// Verificando se já existe este slug pois deve ser único
		let existingPost = await Post.findOne({ slug });
		let counter = 2;

		while (existingPost) {
		slug = `${baseSlug}-${counter}`; // Sempre baseado no slug original
		existingPost = await Post.findOne({ slug });
		counter++;
		}

		const newPost = new Post({ user:user?._id, slug, ...req.body });
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

export const deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const clerkUserId = req.auth?.userId;
		if (!clerkUserId) {
			res.status(401).json({ message: "Not authenticated" }); return;
		}

		const user = await User.findOne({ clerkUserId });
		if (!user) {
			res.status(404).json({ message: "User not found" }); return;
		}

		const deletedPost = await Post.findOneAndDelete({ 
			_id: req.params.id, 
			user: user._id 
		});

		if (!deletedPost) {
			res.status(403).json({ message: "You can only delete your own posts" }); return;
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



// Quando enviar uma requisição da aplicação React, enviarei usando a mesma chave publica e endpoint
// O método getAuthenticationParameters() vai verificar se o usuário que fez a requisição está autenticado 
// para então iniciar o processo de upload
const imagekit = new ImageKit({
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
});

export const uploadAuth = async (req: Request, res: Response) => {
	const result = imagekit.getAuthenticationParameters();
	res.send(result);
}