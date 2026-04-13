import { Router } from "express";
import horaireTravailController from "../controllers/horaireTravail.controller.js";
import { schemas, validateMiddleware } from "../middlewares/validate.middleware.js";
const router = new Router();

router.post(
    '/register',
    horaireTravailController.register
)

router.post(
    '/update',
    horaireTravailController.setActif
)

router.get(
    '/findBySousServiceId/:id',
    horaireTravailController.getBySousServiceId
)
router.patch(
  '/update/:id',       
  validateMiddleware(schemas.scheduleUpdateSchema),  
  horaireTravailController.updateOne
);
export default router;