import JSON from 'graphql-type-json';
import Mutation from './mutation';
import Query from './query/index';
import DateTime from './scalars/dateTime';
import Owner from './types/owner';
import Post from './types/post';
import PostConnection from './types/postConnection';
import PostTag from './types/postTag';
import Test from './types/test';
import Tag from './types/tag';
import User from './types/user';

export default {
  JSON,
  Mutation,
  Query,
  DateTime,
  Owner,
  Post,
  PostConnection,
  PostTag,
  Tag,
  Test,
  User,
};
