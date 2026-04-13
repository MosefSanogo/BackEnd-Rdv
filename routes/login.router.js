import { Router } from "express";
import loginController from "../controllers/login.controller.js";
import rateLimitMiddleware from "../middlewares/rateLimit.middleware.js";

const router = new Router();

router.post(
    '/login',
    rateLimitMiddleware.authLimiter,          // Limite stricte pour login
    rateLimitMiddleware.speedLimiter,         // Ralentissement progressif
    rateLimitMiddleware.generalLimiter,       // Rate limiting global
    loginController.login
)

export default router;