import express from "express";
import { syncUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/sync-user", syncUser);

export default router;