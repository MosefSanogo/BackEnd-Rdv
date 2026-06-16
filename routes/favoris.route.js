import { Router } from "express";
import favorisController  from '../controllers/favoris.controller.js';

const router = Router();

router.post("/register",favorisController.register);
router.get("/findAllFavoris/:id",favorisController.getAllByCitoyenId);
router.delete("/delete/:serviceId/:citoyenId",favorisController.deleteById);

export default router