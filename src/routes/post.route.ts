import express, { Request, Response } from "express";
import { getPosts, getPost, createPost, deletePost, uploadAuth } from "../controllers/post.controller";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
// router.put("/:id", updatePost);

export default router;