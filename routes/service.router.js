import { Router } from "express";
import upload from "../config/storage.js";
import serviceController from "../controllers/service.controller.js";

const router = new Router();

router.post(
    '/register',
    upload.single('image'),
    serviceController.register
)

router.get(
    '/findAllServices',
    serviceController.findAllService
)

router.get(
    '/findAllSousServices/:id',
    serviceController.findSousServiceFromService
)

router.post(
    '/updateServiceActif',
    serviceController.setServiceActif
)

router.post(
    '/updateSousServiceActif',
    serviceController.setSousServiceActif
)




export default router;
