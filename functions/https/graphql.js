const {readFileSync} = require('fs');
const {join} = require('path');

const {graphqlExpress} = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {makeExecutableSchema} = require('graphql-tools');

const failureResponse = require('../helpers/failureResponse').default;
const resolvers = require('../resolvers');

const typeDefsFile = join(__dirname, '..', 'schema.graphqls');

const typeDefs = readFileSync(typeDefsFile, 'utf-8');

const schema = makeExecutableSchema({typeDefs, resolvers});

const graphql = graphqlExpress((request, response) => {
  const headers = request.headers;
  const authorization = headers.authorization;
  if (authorization &&
    authorization.startsWith('Bearer ') &&
    authorization.split('Bearer ')[1]) {
    const idToken = authorization.split('Bearer ')[1];
    return admin.auth().
      verifyIdToken(idToken).
      then((decodedToken) => {
        return admin.firestore().
          collection('users').
          doc(decodedToken.uid).
          get();
      }).
      then((snapshot) => {
        return snapshot.exists
          ? Object.assign({uid: snapshot.id}, snapshot.data())
          : null;
      }).
      then((user) => {
        return {schema, context: {user}};
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  }
  return {schema, context: {}};
});

const filter = (request, response, next) => {
  if (request.method === 'OPTIONS') {
    response.sendStatus(200);
    return;
  }
  if (Object.keys(request.query).length) {
    request.method = 'POST';
    request.url = '/';
    request.body = request.query;
    if (request.body.variables) {
      try {
        request.body.variables = JSON.parse(request.body.variables);
      } catch (e) {
        console.error(e);
      }
    }
  }
  next();
};

const app = express().
  use(cors()).
  use(bodyParser.json()).
  use(filter).
  use(graphql);

exports.default = functions.https.onRequest(app);
