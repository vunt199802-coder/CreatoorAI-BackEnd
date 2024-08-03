const httpStatus = require('http-status');
const { Music } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a music
 * @param {Object} musicBody
 * @returns {Promise<Music>}
 */
const createMusic = async (musicBody) => {
  // if (await Music.isEmailTaken(musicBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Music.create(musicBody);
};

/**
 * Query for musics
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMusics = async (filter, options) => {
  const musics = await Music.paginate(filter, options);
  return musics;
};

/**
 * Get music by id
 * @param {ObjectId} id
 * @returns {Promise<Music>}
 */
const getMusicById = async (id) => {
  return Music.findById(id);
};

const getMusicByTaskId = async (taskId) => {
  return Music.findOne({ task_id: taskId });
};

const getMusicByClipId = async (clipId) => {
  return Music.findOne({ clip_id: clipId });
};

/**
 * Get music by email
 * @param {string} email
 * @returns {Promise<Music>}
 */
const getMusicByEmail = async (email) => {
  return Music.findOne({ email });
};

/**
 * Update music by id
 * @param {ObjectId} musicId
 * @param {Object} updateBody
 * @returns {Promise<Music>}
 */
const updateMusicByClipId = async (clipId, updateBody) => {
  let music = await getMusicByClipId(clipId);
  if (!music) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'Music not found');
    music = await Music.create(updateBody);
  }
  // if (updateBody.email && (await Music.isEmailTaken(updateBody.email, musicId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  else {
    Object.assign(music, updateBody);
    await music.save();
  }
  return music;
};

/**
 * Delete music by id
 * @param {ObjectId} musicId
 * @returns {Promise<Music>}
 */
const deleteMusicById = async (musicId) => {
  const music = await getMusicById(musicId);
  if (!music) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Music not found');
  }
  await Music.remove();
  return music;
};

module.exports = {
  createMusic,
  queryMusics,
  getMusicById,
  getMusicByTaskId,
  getMusicByClipId,
  getMusicByEmail,
  updateMusicByClipId,
  deleteMusicById,
};
