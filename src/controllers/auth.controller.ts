import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const syncUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { clerkUserId, username, email, img } = req.body;
		if (!clerkUserId) {
			res.status(400).json({ message: "Missing Clerk User ID" });
			return;
		}

		// Verifica se o usuário já existe no banco
		let user = await User.findOne({ clerkUserId });

		// Se não existir, cria um novo usuário
		if (!user) {
			user = new User({ clerkUserId, username, email, img });
			await user.save();
		}

		res.status(200).json({ message: "User synced successfully" });
	}
	catch (err) {
		console.error(err);
		next(err);
	}
}