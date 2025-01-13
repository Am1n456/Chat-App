import express from "express";
import { getUsersForSidebar, sendMessage, getMessages } from "../controllers/message.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.route("/users").get(verifyJWt, getUsersForSidebar)

router.route("/:id").get(verifyJWt, getMessages)

router.route("/send/:id").post(verifyJWt, sendMessage)

export default router