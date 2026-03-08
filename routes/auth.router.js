import { Router } from 'express';
import {
    signUp,
    OTPverification,
    signin,
    deleteUser,listUser, userProfile
} from '../controllers/auth.controller.js';
const router = Router();
import authenticate from '../middlewares/auth.js';

router.post('/signup', signUp);
router.post('/otp-verification', OTPverification);
router.post('/signin', signin);
router.get("/user-list/:limit/:page",authenticate,listUser)
router.delete("/users/:id", authenticate,deleteUser);
router.get("/user-profile/:id",authenticate,userProfile);

export default router;
