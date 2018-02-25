import { graphqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { readFileSync } from 'fs'
import { makeExecutableSchema } from 'graphql-tools'
import { join } from 'path'

import { failureResponse } from '../helpers/failureResponse'
import resolvers from '../resolvers'

const typeDefsFile = join(__dirname, '..', 'schema.graphqls')

const typeDefs = readFileSync(typeDefsFile, 'utf-8')

const schema = makeExecutableSchema({typeDefs, resolvers})

const graphql = graphqlExpress((request, response) => {
  const {authorization} = request.headers

  if (authorization &&
    authorization.startsWith('Bearer ') &&
    authorization.split('Bearer ')[1]) {
    const idToken = authorization.split('Bearer ')[1]
    return admin.auth().verifyIdToken(idToken).then((decodedToken) => {
      const user = {
        displayName: decodedToken.name || '',
        photoURL: decodedToken.picture || '',
        uid: decodedToken.uid,
        email: decodedToken.email || ''
      }
      return {schema, context: {user}}
    }).catch((err) => {
      return failureResponse(response, err)
    })
  }
  return {schema, context: {}}
})

const filter = (request, response, next) => {
  if (request.method === 'OPTIONS') {
    response.sendStatus(200)
    return
  }

  if (request.method === 'GET') {
    request.method = 'POST'
    request.url = '/'
    request.body = request.body || request.query
    if (typeof request.body.variables === 'string') {
      try {
        request.body.variables = JSON.parse(request.body.variables)
      } catch (e) {
        console.error(e)
      }
    }
  }
  next()
}

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(filter)
  .use(graphql)

export default functions.https.onRequest(app)
