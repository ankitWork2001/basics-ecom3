import {Router} from "express";
import {body,validationResult} from "express-validator";

const router=Router();

import {signup,login,details,update,remove} from "../controllers/user.controllers.js";
import { authenticate } from "../auth.js";

router.route("/signup").post(body('username').isLength({min:3}),body('email').isEmail(),body('password').isLength({min:3}),signup);

router.route("/login").post(login);

router.route("/details").post(authenticate,details);

router.route("/update").patch(authenticate,update);

router.route("/delete").post(authenticate,remove);

export default router;