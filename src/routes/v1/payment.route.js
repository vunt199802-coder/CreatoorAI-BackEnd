const express = require('express');
const paymentController = require('../../controllers/payment.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/config', paymentController.configFunc);
router.get('/checkout-session', auth(), paymentController.checkoutSession);
router.post('/create-checkout-session', auth(), paymentController.createCheckoutSession);

router.route('/').post(auth(), paymentController.createOrder).get(auth(), paymentController.getOrders);
router
  .route('/:orderId')
  .get(auth(), paymentController.getOrder)
  .patch(auth(), paymentController.updateOrder)
  .delete(auth(), paymentController.deleteOrder);

module.exports = router;
