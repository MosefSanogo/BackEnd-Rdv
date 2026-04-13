import { Router } from "express";
import pauseController from "../controllers/pause.controller.js";

const router = new Router()

router.post(
    '/register',
    pauseController.register
)

router.get(
    '/getAllPauses/:serviceId',
    pauseController.getAllPausesBySousServiceId
)

router.delete(
    '/deletePause/:serviceId',
    pauseController.deleteFromPauseBySousServiceId
)


export default router;