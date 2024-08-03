const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
// const { roles } = require('../config/roles');

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    session_id: {
      type: String,
    },
    amount_subtotal: {
      type: Number,
    },
    amount_total: {
      type: Number,
    },
    currency: {
      type: String,
    },
    payment_intent: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

paymentSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'userId',
    },
  ]);
  next();
});

/**
 * @typedef Payment
 */
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
