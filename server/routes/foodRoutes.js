import express from 'express';
import { getFoods, getFoodById, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFoods);
router.post('/', protect, admin, createFood);
router.get('/:id', getFoodById);
router.put('/:id', protect, admin, updateFood);
router.delete('/:id', protect, admin, deleteFood);


export default router;
