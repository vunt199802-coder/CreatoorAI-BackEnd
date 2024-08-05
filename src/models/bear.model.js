const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
// const { roles } = require('../config/roles');

const bearSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    prompt: {
      type: String,
    },
    taskIds: {
      type: Array,
    },
    suggestionClipIds: {
      type: Array,
    },
    finalClipIds: {
      type: Array,
    },
    status: {
      type: String,
      default: 'on-holding',
    },
    payment_status: {
      type: String,
      default: 'unpaid',
    },
    session_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bearSchema.plugin(toJSON);
bearSchema.plugin(paginate);

bearSchema.pre('save', async function (next) {
  const bear = this;
  if (bear.isModified('password')) {
    bear.password = await bcrypt.hash(bear.password, 8);
  }
  next();
});

bearSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'userId',
    },
  ]);
  next();
});

/**
 * @typedef Bear
 */
const Bear = mongoose.model('Bear', bearSchema);

module.exports = Bear;
