import { Router } from "express";
import timeSlotController  from '../controllers/timeSlot.contreller.js';

const router = new Router();

router.post(
    '/generate',
    timeSlotController.generate
)

export default router;