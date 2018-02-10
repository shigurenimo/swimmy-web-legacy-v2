const {readFile} = require('fs');
const {join} = require('path');

const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const failureResponse = require('../helpers/failureResponse').default;
const successResponse = require('../helpers/successResponse').default;

const batchLimit = 450; // < 500
const limit = 40;
const collectionName = 'test-posts';
const merge = false;

exports.default = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    return readData().
      then((data) => {
        return writeData(data);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const writeData = (tasks) => {
  const firestore = admin.firestore();

  const batches = tasks.map((posts) => {
    const batch = firestore.batch();

    posts.forEach((post) => {
      const ref = firestore.
        collection(collectionName).
        doc(post.id);
      batch.set(ref, post, {merge: merge});
    });

    return batch.commit();
  });

  return Promise.all(batches);
};

const readData = () => {
  const inputUserFile = join(__dirname, '..', 'exports', 'posts.json');

  return new Promise((resolve) => {
    return readFile(inputUserFile, 'utf-8', (err, res) => {
      const posts = [];

      const resJson = res.
        split('\n').
        filter((line) => {
          return line;
        }).
        map((line) => {
          return JSON.parse(line);
        });

      resJson.forEach((res, index) => {
        if (index > limit) {
          return;
        }
        const batchIndex = Math.ceil((index + 1) / batchLimit) - 1;
        if (!posts[batchIndex]) {
          posts[batchIndex] = [];
        }
        const post = {
          id: res._id,
          content: res.content,
          createdAt: res.createdAt.$date,
          channelId: null,
          from: 'sw',
          ownerId: res.ownerId || null,
          tags: {},
          repliedPostCount: (res.repliedPostIds || []).length || 0,
          repliedPostIds: res.repliedPostIds || [],
          replyPostId: res.replyPostId || null,
          updatedAt: res.createdAt.$date,
          webURL: null,
          photoURLs: res.images
            ? res.images.map((image) => {
              if (image.full) {
                return {
                  default: image.full.split(/\.(?=[^.]+$)/)[0],
                };
              } else {
                console.log('image.full not found');
                console.log(image);
                return null;
              }
            })
            : [],
        };

        let web = null;

        if (res.web) {
          web = res.web;
        }

        if (res.extension && res.extension.web) {
          web = res.extension.web;
        }

        if (web) {
          post.webURL = web.url;
          post.oEmbed = web.oEmbed || null;
        }

        posts[batchIndex].push(post);
      });

      resolve(posts);
    });
  });
};
