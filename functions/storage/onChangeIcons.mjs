import fs from 'fs';
import os from 'os';
import path from 'path';

import {spawn} from 'child-process-promise';
import * as admin from 'firebase-admin';
import mkdirp from 'mkdirp-promise';

import config from '../config';

import {toFileUrl} from '../utils/toStoragePath';
import {USERS} from '../constants/index';

export const onChangeIcons = (event) => {
  const BUCKET_NAME = config.bucket.icon;
  const ICON_DIR = config.defaultBucket.icon;

  const contentType = event.data.contentType;

  const filePath = event.data.name;

  const fileName = path.basename(filePath);
  // icons/rwRKm6OsSggwAS6zEJYsYRDJyXw1

  const uid = fileName.replace(`${ICON_DIR}/`, '');
  // rwRKm6OsSggwAS6zEJYsYRDJyXw1

  const tmp = os.tmpdir();
  const tmpDir = path.join(tmp, ICON_DIR);

  const tmpFile = path.join(tmp, fileName);
  const tmpOutFile = path.join(tmp, `out_${fileName}`);

  const bucket = admin.storage().bucket(event.data.bucket);
  const outBucket = admin.storage().bucket(BUCKET_NAME);

  const metadata = {contentType};

  const Users = admin.firestore().collection(USERS);

  return mkdirp(tmpDir).
    then(() => {
      return bucket.file(filePath).download({destination: tmpFile});
    }).
    then(() => {
      return spawn('convert', [
        tmpFile,
        '-thumbnail',
        `128x128^`,
        '-gravity',
        'center',
        '-extent',
        `128x128`,
        tmpOutFile,
      ], {
        capture: ['stdout', 'stderr'],
      });
    }).
    then(() => {
      fs.unlinkSync(tmpFile);
      return outBucket.upload(tmpOutFile, {destination: uid, metadata});
    }).
    then(() => {
      fs.unlinkSync(tmpOutFile);

      const utc = new Date().getTime();
      const photoURL = toFileUrl(BUCKET_NAME, uid, {utc});

      console.log(photoURL);

      return Promise.all([
        Users.doc(uid).set({photoURL: photoURL}, {merge: true}),
        admin.auth().updateUser(uid, {photoURL: photoURL}),
      ]);
    }).
    catch((err) => {
      console.error(err);
    });
};
