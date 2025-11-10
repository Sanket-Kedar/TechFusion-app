import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  approveCancelRequest,
  rejectCancelRequest
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/approve-cancel').put(protect, admin, approveCancelRequest);
router.route('/:id/reject-cancel').put(protect, admin, rejectCancelRequest);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
