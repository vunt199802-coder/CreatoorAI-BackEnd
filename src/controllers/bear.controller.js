const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bearService, emailService } = require('../services');

const createBear = catchAsync(async (req, res) => {
  const bear = await bearService.createBear(req.body);
  res.status(httpStatus.CREATED).send(bear);
});

const getBears = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'payment_status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bearService.queryBears(filter, options).then((resp) => resp.results);
  res.send(result);
});

const getBear = catchAsync(async (req, res) => {
  const bear = await bearService.getBearById(req.params.bearId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  res.send(bear);
});

const getMyBears = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const bear = await bearService.getBearsByUserId(_id);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  const data = [...bear];
  res.send(data);
});

const updateBear = catchAsync(async (req, res) => {
  const bear = await bearService.updateBearById(req.params.bearId, req.body);
  res.send(bear);
});

const manageBear = catchAsync(async (req, res) => {
  const { email } = req.body;
  const { bearId } = req.params;
  const bear = await bearService.updateBearByBearId(bearId, req.body);
  await emailService.sendBearApproveEmail(email);
  res.send(bear);
});

const deleteBear = catchAsync(async (req, res) => {
  await bearService.deleteBearById(req.params.bearId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBear,
  getBears,
  getBear,
  getMyBears,
  updateBear,
  manageBear,
  deleteBear,
};
