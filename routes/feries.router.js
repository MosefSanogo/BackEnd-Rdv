import { Router } from "express";
import feriesController from "../controllers/feries.controller.js";

const router = Router();

router.post(
    '/register',
    feriesController.register
);

router.get(
    '/findByServiceId/:id',
    feriesController.getByServiceId
)

export default router;