import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { readFile, writeFileSync } from 'fs';
import { join } from 'path';
import { getPhotoURL } from '../api/microservices/getPhotoURL';

import { failureResponse } from '../helpers/failureResponse';
import { getDownloadURL } from '../helpers/getDownloadURL';
import { successResponse } from '../helpers/successResponse';

const batchLimit = 450; // < 500
const limit = 20000;
const collectionPostsName = 'posts';
const collectionTagsName = 'tags';
const merge = true;
const startAt = 0;

export = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    return readData().then((data) => {
      return createTags(data);
    }).then(([posts, tags]) => {
      return Promise.all([
        // writeTagsToFile(tags),
        // writePostsToFile(posts),
        toTasks(tags).then((data) => {
          return writeTagsData(data);
        }),
        toTasks(posts).then((data) => {
          return writePostsData(data);
        })
      ]);
    }).then(() => {
      return successResponse(response);
    }).catch((err) => {
      return failureResponse(response, err);
    });
  });
})

const writeTagsToFile = (tags) => {
  return new Promise((resolve) => {
    const lines = tags.map((tag) => {
      return JSON.stringify(tag);
    }).join('\n');

    const filePath = join(__dirname, '..', 'internals', 'tags.json');

    writeFileSync(filePath, lines);

    resolve(tags);
  });
};

const writePostsToFile = (posts) => {
  return new Promise((resolve) => {
    const lines = posts.map((tag) => {
      return JSON.stringify(tag);
    }).join('\n');

    const filePath = join(__dirname, '..', 'internals', 'posts.json');

    writeFileSync(filePath, lines);

    resolve(posts);
  });
};

const writePostsData = (tasks) => {
  const firestore = admin.firestore();

  const batches = tasks.map((posts) => {
    const batch = firestore.batch();

    posts.forEach((post) => {
      const ref = firestore.collection(collectionPostsName).doc(post.id);
      try {
        batch.set(ref, post, { merge: merge });
      } catch (e) {
        console.log(e);
        console.log(post);
      }
    });

    return batch.commit();
  });

  return Promise.all(batches);
};

const writeTagsData = (tasks) => {
  const firestore = admin.firestore();

  const batches = tasks.map((tags) => {
    const batch = firestore.batch();

    tags.forEach((tag) => {
      const ref = firestore.collection(collectionTagsName).doc(tag.id);
      try {
        batch.set(ref, tag, { merge: merge });
      } catch (e) {
        console.log(e);
        console.log(tag);
      }
    });

    return batch.commit();
  });

  return Promise.all(batches);
};

const toTasks = (posts) => {
  return new Promise((resolve) => {

    const tasks = [];

    posts.forEach((post, index) => {
      if (index > limit) {
        return;
      }
      const batchIndex = Math.ceil((index + 1) / batchLimit) - 1;
      if (!tasks[batchIndex]) {
        tasks[batchIndex] = [];
      }
      tasks[batchIndex].push(post);
    });

    resolve(tasks);
  });
};

const readData = () => {
  const inputUserFile = join(__dirname, '..', '..', 'exports', 'posts.json');

  return new Promise((resolve) => {
    return readFile(inputUserFile, 'utf-8', async (err, res) => {
      if (err) { throw err; }
      const postsPromise = res.split('\n')
        .filter((line) => {
          return line;
        })
        .map((line) => {
          return JSON.parse(line);
        })
        .filter((line, index) => {
          return startAt <= index && index < limit;
        })
        .map(async (res) => {
          const post = {
            id: res._id,
            content: res.content,
            createdAt: new Date(res.createdAt.$date),
            channelId: null,
            from: 'swimmy',
            ownerId: res.ownerId || null,
            owner: null,
            photoURLs: {},
            photoURL: null,
            tags: res.reactions,
            repliedPostCount: (res.repliedPostIds || []).length || 0,
            repliedPostIds: res.repliedPostIds || [],
            replyPostId: res.replyPostId || null,
            updatedAt: new Date(res.createdAt.$date),
            webURL: null
          } as any;

          if (res.images) {
            for (let i = 0; i < res.images.length; ++i) {
              const image = res.images[i];
              const photoId = image.full.split(/\.(?=[^.]+$)/)[0];
              const photoURL = getDownloadURL('posts', photoId);
              const data = await getPhotoURL('posts', photoId, photoURL);
              post.photoURLs[photoId] = data;
              post.photoURL = data.photoURL;
            }
          }

          let web = null;

          if (res.web) {
            web = res.web;
          }

          if (res.extension && res.extension.web) {
            web = res.extension.web;
          }

          if (web && web.url) {
            post.webURL = web.url;
            post.oEmbed = web.oEmbed || null;
          }

          return post;
        });

      /*
      for (let i = 0; i < posts.length; ++i) {
        const post = posts[i];
        if (post.photoURL) {
          const photoId = post.photoURL;
          console.log('photoId', photoId);
          try {
            const photoURL = getDownloadURL('posts', photoId);
            const data = await getPhotoURL('posts', photoId, photoURL);
            post.photoURLs[photoId] = data;
            post.photoURL = data.photoURL;
          } catch (err) {
            console.error(err);
          }
        }
      }
      */

      const posts = await Promise.all(postsPromise)

      console.log('done');

      resolve(posts);
    });
  });
};

const createTags = (posts) => {
  const tags = {};
  const tagNames = {};

  const newPosts = posts.map((post) => {
    const postTags = {};
    post.tags.forEach((tag) => {
      const tagCount = tag.ownerIds.length;
      if (!tagNames[tag.name]) {
        const tagId = admin.firestore().collection('tags').doc().id;
        tagNames[tag.name] = tagId;
        tags[tagId] = {
          id: tagId,
          name: tag.name,
          count: tagCount,
          createdAt: post.createdAt,
          updatedAt: post.createdAt
        };
        postTags[tagId] = {
          name: tag.name,
          count: tagCount,
          createdAt: post.createdAt,
          updatedAt: post.createdAt
        };
      } else {
        const tagId = tagNames[tag.name];
        tags[tagId] = {
          id: tagId,
          name: tags[tagId].name,
          count: tags[tagId].count + tagCount,
          createdAt: tags[tagId].createdAt > post.createdAt
            ? post.createdAt
            : tags[tagId].createdAt,
          updatedAt: tags[tagId].createdAt < post.createdAt
            ? post.createdAt
            : tags[tagId].createdAt
        };
        postTags[tagId] = {
          name: tag.name,
          count: tagCount,
          createdAt: post.createdAt,
          updatedAt: post.createdAt
        };
      }
    });
    return Object.assign(post, { tags: postTags });
  });

  const newTags = Object.keys(tags).map((tagId) => tags[tagId]);

  return [newPosts, newTags];
};
