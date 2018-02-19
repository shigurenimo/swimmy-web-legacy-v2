import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

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


if (!FUNCTION_NAME || FUNCTION_NAME === 'graphql') {
  exports.graphql = require('./https/graphql').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'hello') {
  exports.hello = require('./https/hello').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'importUser') {
  exports.importUser = require('./https/importUser').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'uploadPosts') {
  exports.uploadPosts = require('./https/uploadPosts').default;
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'uploadUsers') {
  exports.uploadUsers = require('./https/uploadUsers').default;
}
