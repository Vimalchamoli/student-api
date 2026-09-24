import express from "express";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  profile,
  adminTest,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, profile);
router.get("/admin-test", verifyToken, authorize("admin"), adminTest);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyToken, logout);
export default router;
