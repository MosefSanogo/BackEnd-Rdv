import { Router } from "express";
import rulesController from "../controllers/rules.controller.js";

const router = new Router();
router.post(
    '/register',
    rulesController.register
);
router.get(
    '/findByServiceId/:id', // Cache pendant 10 minutes
    rulesController.getByServiceId
);
export default router;
