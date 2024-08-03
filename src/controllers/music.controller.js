const httpStatus = require('http-status');
const axios = require('axios');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { musicService, bearService, emailService } = require('../services');

const getMusic = catchAsync(async (req, res) => {
  const music = await musicService.getMusicByClipId(req.params.clipId);
  if (!music) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bear not found');
  }
  res.send(music);
});

const generateMusic = catchAsync(async (req, res) => {
  const { prompt } = req.body;
  const { _id, email } = req.user;

  let index = 0;
  let taskIds = [];
  while (index < 3) {
    // eslint-disable-next-line no-await-in-loop
    const newTaskId = await axios
      .post(
        'https://api.goapi.ai/api/suno/v1/music',
        {
          custom_mode: false,
          mv: 'chirp-v3-5',
          input: {
            gpt_description_prompt: prompt,
            make_instrumental: false,
          },
        },
        {
          headers: {
            'X-API-Key': config.goapi_key,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((resp) => {
        return resp.data.data.task_id;
      })
      .catch((err) => {
        console.log('err :>> ', err);
        return err;
      });

    taskIds = [...taskIds, newTaskId];
    index += 1;
  }

  const result = await bearService.createBear({ userId: _id, taskIds, prompt });

  // await emailService.sendOrderPaidEmail(email);

  // const result = {
  //   code: 200,
  //   data: {
  //     task_id: 'f170d906-0538-4403-a8bf-c89012d28b87',
  //   },
  //   message: 'success',
  // };
  // await musicService.createMusic({ email, ...result.data });

  res.send({ result });
});

const getGenerationResult = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const newMusics = await axios
    .get(`https://api.goapi.ai/api/suno/v1/music/${taskId}`, {
      headers: {
        'X-API-Key': config.goapi_key,
        'Content-Type': 'application/json',
      },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      return err;
    });

  const clips = Object.values(newMusics.data.clips);
  let j = 0;
  while (j < 2) {
    // eslint-disable-next-line no-await-in-loop
    await musicService.updateMusicByClipId(clips[j].id, {
      task_id: newMusics.data.task_id,
      clip_id: clips[j].id,
      clip_data: clips[j],
      status: newMusics.data.status,
      input: newMusics.data.input,
    });
    j += 1;
  }

  // const result = {
  //   code: 200,
  //   data: {
  //     task_id: 'f170d906-0538-4403-a8bf-c89012d28b87',
  //     status: 'completed',
  //     input:
  //       '{"custom_mode":false,"gpt_description_prompt":"sunshine","make_instrumental":false,"prompt":"","title":"","continue_at":0,"continue_clip_id":"","mv":"chirp-v3-5","tags":""}',
  //     clips: {
  //       '0f83dcf1-c023-4ba5-96a2-4333136ee970': {
  //         id: '0f83dcf1-c023-4ba5-96a2-4333136ee970',
  //         video_url: 'https://cdn1.suno.ai/0f83dcf1-c023-4ba5-96a2-4333136ee970.mp4',
  //         audio_url: 'https://cdn1.suno.ai/0f83dcf1-c023-4ba5-96a2-4333136ee970.mp3',
  //         image_url: 'https://cdn2.suno.ai/image_0f83dcf1-c023-4ba5-96a2-4333136ee970.jpeg',
  //         image_large_url: 'https://cdn2.suno.ai/image_large_0f83dcf1-c023-4ba5-96a2-4333136ee970.jpeg',
  //         is_video_pending: true,
  //         major_model_version: 'v3.5',
  //         model_name: 'chirp-v3',
  //         metadata: {
  //           tags: 'pop acoustic',
  //           prompt:
  //             "[Verse]\nSunshine on my face\nWaking up the day\nDreams we can't erase\nLet's get out and play\n\n[Verse 2]\nRunning through the streets\nLaughter never ends\nWarmth beneath our feet\nChasing sun with friends\n\n[Chorus]\nOh oh oh let's go and find\nSunshine bright a piece of mind\nOh oh oh together we'll climb\nUp high where the sun will shine\n\n[Bridge]\nNo worries just this moment\nFeel the breeze and hold it\nEvery ray a golden token\nHearts never broken\n\n[Verse 3]\nSummer in our hearts\nColors all around\nPainting blurry parts\nNew memories found\n\n[Chorus]\nOh oh oh let's go and find\nSunshine bright a piece of mind\nOh oh oh together we'll climb\nUp high where the sun will shine",
  //           gpt_description_prompt: 'sunshine',
  //           audio_prompt_id: '',
  //           history: null,
  //           concat_history: null,
  //           type: 'gen',
  //           duration: 110,
  //           refund_credits: false,
  //           stream: true,
  //           error_type: '',
  //           error_message: '',
  //         },
  //         is_liked: false,
  //         user_id: '',
  //         display_name: '',
  //         handle: '',
  //         is_handle_updated: false,
  //         is_trashed: false,
  //         reaction: null,
  //         created_at: '2024-07-25T15:39:27.078Z',
  //         status: 'complete',
  //         title: 'Chasing Sunshine',
  //         play_count: 0,
  //         upvote_count: 0,
  //         is_public: false,
  //       },
  //       '257149b0-4e42-463e-a70e-108abcd01af5': {
  //         id: '257149b0-4e42-463e-a70e-108abcd01af5',
  //         video_url: 'https://cdn1.suno.ai/257149b0-4e42-463e-a70e-108abcd01af5.mp4',
  //         audio_url: 'https://cdn1.suno.ai/257149b0-4e42-463e-a70e-108abcd01af5.mp3',
  //         image_url: 'https://cdn2.suno.ai/image_257149b0-4e42-463e-a70e-108abcd01af5.jpeg',
  //         image_large_url: 'https://cdn2.suno.ai/image_large_257149b0-4e42-463e-a70e-108abcd01af5.jpeg',
  //         is_video_pending: true,
  //         major_model_version: 'v3.5',
  //         model_name: 'chirp-v3',
  //         metadata: {
  //           tags: 'pop acoustic',
  //           prompt:
  //             "[Verse]\nSunshine on my face\nWaking up the day\nDreams we can't erase\nLet's get out and play\n\n[Verse 2]\nRunning through the streets\nLaughter never ends\nWarmth beneath our feet\nChasing sun with friends\n\n[Chorus]\nOh oh oh let's go and find\nSunshine bright a piece of mind\nOh oh oh together we'll climb\nUp high where the sun will shine\n\n[Bridge]\nNo worries just this moment\nFeel the breeze and hold it\nEvery ray a golden token\nHearts never broken\n\n[Verse 3]\nSummer in our hearts\nColors all around\nPainting blurry parts\nNew memories found\n\n[Chorus]\nOh oh oh let's go and find\nSunshine bright a piece of mind\nOh oh oh together we'll climb\nUp high where the sun will shine",
  //           gpt_description_prompt: 'sunshine',
  //           audio_prompt_id: '',
  //           history: null,
  //           concat_history: null,
  //           type: 'gen',
  //           duration: 138,
  //           refund_credits: false,
  //           stream: true,
  //           error_type: '',
  //           error_message: '',
  //         },
  //         is_liked: false,
  //         user_id: '',
  //         display_name: '',
  //         handle: '',
  //         is_handle_updated: false,
  //         is_trashed: false,
  //         reaction: null,
  //         created_at: '2024-07-25T15:39:27.078Z',
  //         status: 'complete',
  //         title: 'Chasing Sunshine',
  //         play_count: 0,
  //         upvote_count: 0,
  //         is_public: false,
  //       },
  //     },
  //     metadata: {
  //       created_at: '2024-07-25T15:39:24.940051217Z',
  //       started_at: '2024-07-25T15:39:25.398898317Z',
  //       ended_at: '2024-07-25T15:41:57.811406215Z',
  //       quota_frozen: 10,
  //       quota_usage: 10,
  //     },
  //   },
  //   message: 'success',
  // };
  res.send(clips);
});

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

module.exports = {
  getMusic,
  generateMusic,
  getGenerationResult,
};
