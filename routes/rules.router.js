import { Router } from "express";
import rulesController from "../controllers/rules.controller.js";

const router = new Router();
router.post(
    '/register',
    rulesController.register
);
router.get(
    '/findByServiceId/:id',
    rulesController.getByServiceId
);
export default router;
