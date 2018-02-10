const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const FUNCTION_NAME = process.env.FUNCTION_NAME;

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreateUser') {
  exports.onCreateUser = require('./auth/onCreateUser').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeleteUser') {
  exports.onDeleteUser = require('./auth/onDeleteUser').default;
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreatePost') {
  exports.onCreatePost = require('./firestore/onCreatePost').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeletePost') {
  exports.onDeletePost = require('./firestore/onDeletePost').default;
}

// https

if (!FUNCTION_NAME || FUNCTION_NAME === 'addPost') {
  exports.addPost = require('./https/addPost').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'deletePost') {
  exports.deletePost = require('./https/deletePost').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'graphql') {
  exports.graphql = require('./https/graphql').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'updatePostTags') {
  exports.updatePostTags = require('./https/updatePostTags').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'uploadPosts') {
  exports.uploadPosts = require('./https/uploadPosts').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'uploadUsers') {
  exports.uploadUsers = require('./https/uploadUsers').default;
}

// storage

if (!FUNCTION_NAME || FUNCTION_NAME === 'onChangeStorage') {
  exports.onChangeStorage = require('./storage').default;
}
