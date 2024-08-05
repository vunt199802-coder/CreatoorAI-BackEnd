const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const { bearController } = require('../../controllers');

const router = express.Router();

router.route('/').get(bearController.getBears);
router.route('/myBear').get(auth(), bearController.getMyBears);

router
  .route('/:bearId')
  .get(bearController.getBear)
  .patch(auth(), bearController.updateBear)
  .delete(auth(), bearController.deleteBear);

router.route('/manage/:bearId').patch(auth(), bearController.manageBear);

module.exports = router;
