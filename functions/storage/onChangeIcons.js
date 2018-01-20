const path = require('path');
const os = require('os');
const fs = require('fs');

const {spawn} = require('child-process-promise');
const admin = require('firebase-admin');
const mkdirp = require('mkdirp-promise');

exports.default = (event) => {
  const contentType = event.data.contentType;

  const filePath = event.data.name;

  const fileName = path.basename(filePath);
  // icons/rwRKm6OsSggwAS6zEJYsYRDJyXw1.png

  const uid = fileName.match(/(.*)(?:\.([^.]+$))/)[1];
  // rwRKm6OsSggwAS6zEJYsYRDJyXw1

  const outFilePath = path.normalize(fileName);
  // rwRKm6OsSggwAS6zEJYsYRDJyXw1.png

  const tmp = os.tmpdir();
  const tmpDir = path.join(tmp, 'icons');

  const tmpFile = path.join(tmp, fileName);
  const tmpOutFile = path.join(tmp, `out_${fileName}`);

  const bucket = admin.storage().bucket(event.data.bucket);
  const outBucket = admin.storage().bucket('sw-icons');

  const metadata = {contentType};

  const Users = admin.firestore().collection('users');

  return mkdirp(tmpDir).
    then(() => {
      return bucket.file(filePath).download({destination: tmpFile});
    }).
    then(() => {
      // Convert
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
      return outBucket.upload(tmpOutFile, {
        destination: outFilePath,
        metadata: metadata,
      });
    }).
    then(() => {
      fs.unlinkSync(tmpFile);
      fs.unlinkSync(tmpOutFile);
      const photoURL = toFileUrl('okinawa-likes-icons', outFilePath);
      return Users.doc(uid).set({
        photoURL: photoURL,
      }, {merge: true});
    }).
    then(() => {
      const photoURL = toFileUrl('okinawa-likes--icons', outFilePath);
      return admin.auth().updateUser(uid, {
        photoURL: photoURL,
      });
    }).
    catch(err => {
      console.error(err);
    });
};

const toFileUrl = (bucketName, filePath) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&utc=${new Date().getTime()}`;
