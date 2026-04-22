const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, webhookHandler } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

module.exports = router;
