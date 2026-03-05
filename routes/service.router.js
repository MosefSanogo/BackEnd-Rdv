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
router.get(
    '/getSousServiceActif/:id',
    serviceController.getSousServiceActif
)
router.get(
    '/getCountSousServiceActif/:id',
    serviceController.getCountSousServiceActif
)
router.get(
    '/getSousServiceWithParams/:id',
    serviceController.getSousServiceWithParams
)
router.post(
    '/addSousService',
    serviceController.addSousService
)
router.delete(
    '/deleteSousService/:id',
    serviceController.deleteSousService
)



export default router;
