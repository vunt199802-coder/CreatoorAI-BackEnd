const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const musicValidation = require('../../validations/music.validation');
const musicController = require('../../controllers/music.controller');

const router = express.Router();

router.route('/:clipId').get(musicController.getMusic);
router.route('/generate').post(auth(), validate(musicValidation.generateMusic), musicController.generateMusic);
router
  .route('/getGenerationResult/:taskId')
  .get(auth(), validate(musicValidation.getGenerationResult), musicController.getGenerationResult);

module.exports = router;
