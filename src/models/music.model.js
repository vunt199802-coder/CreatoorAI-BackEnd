const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
// const { roles } = require('../config/roles');

const musicSchema = mongoose.Schema(
  {
    task_id: { type: String, required: true },
    clip_id: { type: String, unique: true, required: true },
    clip_data: {
      type: Object,
    },
    status: {
      type: String,
    },
    input: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
musicSchema.plugin(toJSON);
musicSchema.plugin(paginate);

musicSchema.pre('save', async function (next) {
  const music = this;
  if (music.isModified('password')) {
    music.password = await bcrypt.hash(music.password, 8);
  }
  next();
});

/**
 * @typedef Music
 */
const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
