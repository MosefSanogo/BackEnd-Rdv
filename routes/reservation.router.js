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
    '/findByDateAndServiceGroupByTime/:date/:id',
    reservationController.getByDateAndServiceGroupByTime
);

router.get(
    '/findByQrCode/:qrCode',
    reservationController.getByQrCode
);

router.post(
    '/updateStatut',
    reservationController.setStatus
);

router.get(
    '/findAllClientReservation/:id',
    reservationController.getAllClientReservation
)
router.get(
    '/findClientReservation/:id',
    reservationController.getClientReservation
)
router.get(
    '/findStatisticByService/:id',
    reservationController.getStatisticByServiceId
)
router.get(
    '/findHourlyDataByServiceIdAndDate/:id/:date',
    reservationController.getHourlyDataByServiceIdAndDate
)
router.get(
    '/findDayServiceDistributionByServiceIdAndDate/:id/:date',
    reservationController.getDayServiceDistributionByServiceIdAndDate
)
router.get(
    '/findWeeklyDataByServiceIdAndDate/:id/:date',
    reservationController.getWeeklyDataByServiceIdAndDate
)
router.get(
    '/findWeeklyServiceDistributionByServiceIdAndDate/:id/:date',
    reservationController.getWeeklyServiceDistributionByServiceIdAndDate
)
router.get(
    '/findMonthlyByServiceIdAndDate/:id/:date',
    reservationController.getMonthlyByServiceIdAndDate
)
router.get(
    '/findMonthlyServiceDistributionByServiceIdAndDate/:id/:date',
    reservationController.getMonthlyServiceDistributionByServiceIdAndDate
)
router.get(
    '/findYearlyByServiceIdAndDate/:id/:date',
    reservationController.getYearlyByServiceIdAndDate
)
router.get(
    '/findYearlyServiceDistributionByServiceIdAndDate/:id/:date',
    reservationController.getYearlyServiceDistributionByServiceIdAndDate
)
export default router;