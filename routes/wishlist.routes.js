import {Router} from 'express';
import { authenticate } from '../auth.js';
import { addToWishlist, getWishlist, removeWishlist } from '../controllers/wishlist.controllers.js';
const router=Router();


router.route("/add").post(authenticate,addToWishlist);
router.route("/get").post(authenticate,getWishlist);
router.route("/remove").post(authenticate,removeWishlist);


export default router;