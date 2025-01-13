import express from "express"
import { registerUser, loginUser, logoutUser, updateProfile, checkAuth } from "../controllers/auth.controller.js"
import { verifyJWt } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(logoutUser)

router.route("/update-profile").put(verifyJWt, updateProfile);

router.route("/check").get(verifyJWt, checkAuth)

export default router