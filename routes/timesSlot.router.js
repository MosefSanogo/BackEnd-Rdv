import { Router } from "express";
import timeSlotController  from '../controllers/timeSlot.contreller.js';

const router = new Router();

router.post(
    '/generate',
    timeSlotController.generate
)

router.get(
    '/getTimeSlots/:service_id/:sous_service_id/:date',
    timeSlotController.getTimeSlots
)

export default router;