import { Router } from "express";
import horaireTravailController from "../controllers/horaireTravail.controller.js";
const router = new Router();

router.post(
    '/register',
    horaireTravailController.register
)

router.post(
    '/update',
    horaireTravailController.setActif
)

export default router;