import User from "../models/user.model";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import { Request, Response } from "express";
import { Webhook } from "svix";

export const clerkWebHook = async (req: Request, res: Response): Promise<void> => {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) 
		throw new Error("Webhook secret needed!");

	const payload = req.body;
	const headers = req.headers as any;

	const wh = new Webhook(WEBHOOK_SECRET);
	let evt: any;
	try {
		evt = wh.verify(payload, headers);
	}
	catch (err) {
		res.status(400).json({
			message: "Webhook verification failed!"
		});
	}

	// Logar os dados do evento para entender a estrutura que o Clerk envia
	console.log(evt.data);

	// Criar usuário
	if (evt.type === "user.created") {
		try {
			const newUser = new User({
				clerkUserId: evt.data.id,
				username: evt.data.username || evt.data.email_addresses[0].email_address,
				email: evt.data.email_addresses[0].email_address,
				img: evt.data.profile_img_url,
			});
	
			await newUser.save();
		}
		catch (err) {
			console.error("Erro ao salvar o usuário:", err);
			res.status(500).json({
				message: "Erro ao criar usuário no banco de dados"
			});
			return;
		}		
	}

	// Deletar usuário e posts associados
	if (evt.type === "user.deleted") {
		try {
			const deletedUser = await User.findOneAndDelete({
				clerkUserId: evt.data.id,
			});
	
			await Post.deleteMany({ user: deletedUser?._id });
			await Comment.deleteMany({ user: deletedUser?._id });
		}
		catch (err) {
			console.error("Erro ao deletar usuário:", err);
			res.status(500).json({
				message: "Erro ao deletar usuário ou posts",
			});
			return;
		}
	}

	res.status(200).json({
		message: "Webhook received",
	});
}