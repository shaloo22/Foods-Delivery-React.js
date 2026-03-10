import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus,
    cancelOrder,
    removeItemFromOrder,
    deleteOrder
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, addOrderItems);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, deleteOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus); // Admin can update to Preparing, etc.
router.route('/:id/cancel').put(protect, cancelOrder); // Both can cancel
router.route('/:id/remove-item').put(protect, removeItemFromOrder);

export default router;

