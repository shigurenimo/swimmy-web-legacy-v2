const { readFileSync } = require('fs')

const admin = require('firebase-admin')
const functions = require('firebase-functions')

const {config} = require('./lib/config')

try {
  const dataStr = readFileSync('./config.json', 'utf-8')
  const data = JSON.parse(dataStr)
  const { projectId } = functions.config().firebase

  config.algolia = data[projectId].algolia
  config.service = data[projectId].service

  const serviceAccount = data[projectId].serviceAccount
  const credential = admin.credential.cert(serviceAccount)

  admin.initializeApp({ credential })
} catch (e) {
  admin.initializeApp(functions.config().firebase)

  if (process.env.NODE_ENV !== 'development') {
    console.error(e)
  }
}

const FUNCTION_NAME = process.env.FUNCTION_NAME

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreateUser') {
  exports.onCreateUser = require('./lib/auth/onCreateUser')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeleteUser') {
  exports.onDeleteUser = require('./lib/auth/onDeleteUser')
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreatePost') {
  exports.onCreatePost = require('./lib/firestore/onCreatePost')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeleteImage') {
  exports.onDeleteImage = require('./lib/firestore/onDeleteImage')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeletePost') {
  exports.onDeletePost = require('./lib/firestore/onDeletePost')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onUpdateUser') {
  exports.onUpdateUser = require('./lib/firestore/onUpdateUser')
}

// https

if (!FUNCTION_NAME || FUNCTION_NAME === 'graphql') {
  exports.graphql = require('./lib/https/graphql')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'graphiql') {
  exports.graphiql = require('./lib/https/graphiql')
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'restoreUser') {
  exports.restoreUser = require('./lib/https/restoreUser')
}
