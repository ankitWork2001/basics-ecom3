import {Router} from "express";
import { authenticate } from "../auth.js";
import { add, applyDiscount, checkOut, remove, view } from "../controllers/cart.controllers.js";

const router=Router();

router.route("/add").post(authenticate,add);
router.route("/view").post(authenticate,view);
router.route("/remove").post(authenticate,remove);
router.route("/checkout").post(authenticate,checkOut);
router.route("/discount").post(authenticate,applyDiscount);

export default router;