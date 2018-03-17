import { graphiqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as functions from 'firebase-functions';

const query = `{
  posts {
    nodes {
      id
      content
      createdAt
      photoURLs
      repliedPostCount
      replyPostId
      tags {
        id
        name
        count
      }
    }
  }
}`;

const endpointURL = process.env.NODE_ENV === 'production'
  ? `https://us-central1-${process.env.GCP_PROJECT}.cloudfunctions.net/graphql/`
  : `/${process.env.GCP_PROJECT}/us-central1/graphql/`;

const options = {endpointURL, query};

const graphiql = graphiqlExpress(options);

const app = express();

app.use(bodyParser.json(), graphiql);

export = functions.https.onRequest(app);
