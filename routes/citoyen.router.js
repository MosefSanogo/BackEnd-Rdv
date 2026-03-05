import { Router } from "express";
import CitoyenController  from '../controllers/citoyen.controller.js';

const router = Router();

router.post(
    "/register",
    CitoyenController.register
)
router.get('/get/citoyens',
    CitoyenController.getCitoyen
)
router.delete('/delete/:id',
    CitoyenController.deleteCitoyen
)
router.get('/getAllClientForService/:id',
    CitoyenController.getAllClientForService
)
router.get('/getCountClientForService/:id',
    CitoyenController.getCountClientForService
)
export default router;