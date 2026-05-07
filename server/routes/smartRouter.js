import express from "express";
import * as fatsecretController from "../controllers/fatsecretController.js";
import * as aiController from "../controllers/aiController.js";
import * as authController from "../controllers/authController.js"

const router = express.Router();

router.get('/fatsecret/search', fatsecretController.searchFood);

router.post('/foodBot/recognize', aiController.recognizeFood)

router.post('/login', authController.loginUser);

router.post('/register', authController.addUser);

export default router;