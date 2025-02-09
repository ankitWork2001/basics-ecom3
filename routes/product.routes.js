import {Router} from "express";
import {details} from "../controllers/product.controllers.js";
import { authenticate } from "../auth.js";
const router=Router();


router.route("/details").post(authenticate,details);



export default router;