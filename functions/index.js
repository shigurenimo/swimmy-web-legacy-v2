const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const FUNCTION_NAME = process.env.FUNCTION_NAME;

// https

if (!FUNCTION_NAME || FUNCTION_NAME === 'addPost') {
  exports.addPost = require('./https/addPost');
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'updatePostTags') {
  exports.updatePostTags = require('./https/updatePostTags');
}

// storage

if (!FUNCTION_NAME || FUNCTION_NAME === 'storage') {
  exports.storage = require('./storage');
}
