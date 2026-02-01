import { Router } from "express";
import reservationController from "../controllers/reservation.controller.js";

const router = new Router();

router.post(
    '/register',
    reservationController.register
);

router.get(
    '/findByDateAndSousService/:date/:id',
    reservationController.getByDateAndSousService
);

router.get(
    '/findByDateAndService/:date/:id',
    reservationController.getByDateAndService
);

router.get(
    '/findByQrCode/:qrCode',
    reservationController.getByQrCode
);

router.post(
    '/updateStatut',
    reservationController.setStatus
);

export default router;