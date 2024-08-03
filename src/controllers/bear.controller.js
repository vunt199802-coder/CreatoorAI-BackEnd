const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bearService, musicService, emailService } = require('../services');

const createBear = catchAsync(async (req, res) => {
  const bear = await bearService.createBear(req.body);
  res.status(httpStatus.CREATED).send(bear);
});

const getBears = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'payment_status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bearService.queryBears(filter, options).then((resp) => resp.results);
  // let i = 0;
  // let data = [];
  // while (result.results.length > i) {
  //   let j = 0;
  //   let clips = [];
  //   while (result.results[i].clipIds.length > j) {
  //     // eslint-disable-next-line no-await-in-loop
  //     const clip = await musicService.getMusicByClipId(result.results[i].clipIds[j]);
  //     clips = [...clips, clip];
  //     j += 1;
  //   }
  //   data = [...data, { ...result.results[i]._doc, clips }];
  //   i += 1;
  // }
  res.send(result);
});

const getBear = catchAsync(async (req, res) => {
  const bear = await bearService.getBearById(req.params.bearId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  res.send(bear);
});

const getMyBear = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const bear = await bearService.getBearByUserId(_id);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  res.send(bear);
});

const updateBear = catchAsync(async (req, res) => {
  const bear = await bearService.updateBearById(req.params.bearId, req.body);
  res.send(bear);
});

const manageBear = catchAsync(async (req, res) => {
  // const { email } = req.body;
  const { bearId } = req.params;
  const bear = await bearService.updateBearByBearId(bearId, req.body);
  // await emailService.sendBearApproveEmail(email);
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
  getMyBear,
  updateBear,
  manageBear,
  deleteBear,
};
