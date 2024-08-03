const httpStatus = require('http-status');
const { Bear } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a bear
 * @param {Object} bearBody
 * @returns {Promise<Bear>}
 */
const createBear = async (bearBody) => {
  return Bear.create(bearBody);
};

/**
 * Query for bears
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBears = async (filter, options) => {
  const bears = await Bear.paginate(filter, options);
  return bears;
};

/**
 * Get bear by id
 * @param {ObjectId} id
 * @returns {Promise<Bear>}
 */
const getBearById = async (id) => {
  return Bear.findById(id);
};

/**
 * Get bear by email
 * @param {string} email
 * @returns {Promise<Bear>}
 */
const getBearByEmail = async (email) => {
  return Bear.findOne({ email });
};

const getBearBySessionId = async (sessionId) => {
  return Bear.findOne({ session_id: sessionId });
};

const getBearByBearId = async (bearId) => {
  return Bear.findOne({ _id: bearId });
};

const getBearByUserId = async (userId) => {
  return Bear.findOne({ userId });
};

/**
 * Update bear by id
 * @param {ObjectId} bearId
 * @param {Object} updateBody
 * @returns {Promise<Bear>}
 */
const updateBearBySessionId = async (sessionId, updateBody) => {
  const bear = await getBearBySessionId(sessionId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  // if (updateBody.email && (await Bear.isEmailTaken(updateBody.email, bearId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(bear, updateBody);
  await bear.save();
  return bear;
};

const updateBearByUserId = async (userId, updateBody) => {
  const bear = await getBearByUserId(userId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  // if (updateBody.email && (await Bear.isEmailTaken(updateBody.email, bearId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(bear, updateBody);
  await bear.save();
  return bear;
};

const updateBearByBearId = async (bearId, updateBody) => {
  const bear = await getBearByBearId(bearId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  // if (updateBody.email && (await Bear.isEmailTaken(updateBody.email, bearId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(bear, updateBody);
  await bear.save();
  return bear;
};

/**
 * Delete bear by id
 * @param {ObjectId} bearId
 * @returns {Promise<Bear>}
 */
const deleteBearById = async (bearId) => {
  const bear = await getBearById(bearId);
  if (!bear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  await bear.remove();
  return bear;
};

module.exports = {
  createBear,
  queryBears,
  getBearById,
  getBearByUserId,
  getBearByEmail,
  updateBearBySessionId,
  updateBearByUserId,
  updateBearByBearId,
  deleteBearById,
};
