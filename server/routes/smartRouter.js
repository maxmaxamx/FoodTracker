import express from "express";
import * as fatsecretController from "../controllers/fatsecretController.js";
import * as aiController from "../controllers/aiController.js";
import * as authController from "../controllers/authController.js";
import * as foodController from "../controllers/foodController.js";

const router = express.Router();

router.get('/', res.status(200).message("Backend is running"));

router.get('/fatsecret/search', fatsecretController.searchFood);

router.post('/foodBot/recognize', aiController.recognizeFood)

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser)

router.post('/register', authController.addUser);

router.get('/check', authController.checkCode);

router.get('/isMe', authController.checkAuth);

router.post('/pushFood', foodController.pushFood);

router.get('/getFood', foodController.getFood);

router.delete('/deleteFood/:id', foodController.deleteFood);

export default router;