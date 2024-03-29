import express from 'express';
import {
  buySubscription,
  checkoutCancelSession,
  checkoutSuccessSession,
} from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Buy Subscription
router.route('/subscribe').post(isAuthenticated, buySubscription);

// Verify Payment and save reference in database
router.route('/payment/checkout-success').get(checkoutSuccessSession);

// Cancel Subscription
router.route('/payment/checkout-cancel').get(checkoutCancelSession);

export default router;
