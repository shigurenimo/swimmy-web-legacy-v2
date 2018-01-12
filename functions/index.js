const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const FUNCTION_NAME = process.env.FUNCTION_NAME;

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreateUser') {
  exports.onCreateUser = require('./auth/onCreateUser');
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeleteUser') {
  exports.onDeleteUser = require('./auth/onDeleteUser');
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreatePost') {
  exports.onCreatePost = require('./firestore/onCreatePost');
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeletePost') {
  exports.onDeletePost = require('./firestore/onDeletePost');
}

// https

if (!FUNCTION_NAME || FUNCTION_NAME === 'addPost') {
  exports.addPost = require('./https/addPost');
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'deletePost') {
  exports.deletePost = require('./https/deletePost');
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'updatePostTags') {
  exports.updatePostTags = require('./https/updatePostTags');
}

// storage

if (!FUNCTION_NAME || FUNCTION_NAME === 'storage') {
  exports.storage = require('./storage');
}
