import express from "express";
import * as fatsecretController from "../controllers/fatsecretController.js";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.get('/fatsecret/search', fatsecretController.searchFood);

router.post('/foodBot/recognize', aiController.recognizeFood)

export default router;