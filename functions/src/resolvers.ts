import * as JSON from 'graphql-type-json';
import { Mutation } from './mutation';
import { Query } from './query/index';
import { DateTime } from './scalars/dateTime';
import { Owner } from './types/owner';
import { PhotoURL } from './types/photoURL';
import { Post } from './types/post';
import { PostConnection } from './types/postConnection';
import { PostTag } from './types/postTag';
import { Tag } from './types/tag';
import { Test } from './types/test';
import { User } from './types/user';

export const resolvers = {
  JSON,
  Mutation,
  Query,
  DateTime,
  Owner,
  PhotoURL,
  Post,
  PostConnection,
  PostTag,
  Tag,
  Test,
  User
};
