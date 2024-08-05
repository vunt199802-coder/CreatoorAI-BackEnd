const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { paymentService, bearService, emailService } = require('../services');

// eslint-disable-next-line import/order
const stripe = require('stripe')(config.stipe.sk, {
  apiVersion: '2020-08-27',
  appInfo: {
    // For sample support and debugging, not required for production:
    name: 'stripe-samples/checkout-one-time-payments',
    version: '0.0.1',
    url: 'https://github.com/stripe-samples/checkout-one-time-payments',
  },
});

const configFunc = catchAsync(async (req, res) => {
  const price = await stripe.prices.retrieve(process.env.PRICE);

  res.send({
    publicKey: config.stipe.pk,
    unitAmount: price.unit_amount,
    currency: price.currency,
  });
});

const checkoutSession = catchAsync(async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

const createCheckoutSession = catchAsync(async (req, res) => {
  const domainURL = config.client.url;
  const { email, _id } = req.user;
  // eslint-disable-next-line camelcase
  const { unit_amount, product_data, clipIds, bearId } = req.body;
  // const { quantity } = req.body;

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the Checkout page
  // [automatic_tax] - to automatically calculate sales tax, VAT and GST in the checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd', // Specify the currency
          product_data,
          unit_amount, // Amount in cents, so $125.00
        },
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/payment/cancel`,
    // automatic_tax: {enabled: true},
  });
  await paymentService.createOrder({
    userId: _id,
    session_id: session.id,
    amount_subtotal: session.amount_subtotal,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_intent: session.payment_intent,
    payment_status: session.payment_status,
    status: session.status,
  });
  console.log('bearId, clipIds, session.id :>> ', bearId, clipIds, session.id);
  await bearService.updateBearByBearId(bearId, {
    finalClipIds: clipIds,
    session_id: session.id,
  });
  console.log('session :>> ', session);

  res.json({ url: session.url });
});

const createOrder = catchAsync(async (req, res) => {
  const order = await paymentService.createOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await paymentService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { orderId } = req.params;
  const order = await paymentService.updateOrderBySessionId(orderId, req.body);
  const bear = await bearService.updateBearBySessionId(orderId, {
    status: 'in-production',
    payment_status: req.body.payment_status,
  });
  // await emailService.sendOrderPaidEmail(email);
  res.send({ order, bear });
});

const deleteOrder = catchAsync(async (req, res) => {
  await paymentService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  configFunc,
  checkoutSession,
  createCheckoutSession,

  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
