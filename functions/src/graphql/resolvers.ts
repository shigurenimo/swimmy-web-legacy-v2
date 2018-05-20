import * as JSON from 'graphql-type-json';
import { PostOrderField } from './enums/PostOrderField';
import { PostType } from './enums/PostType';
import { TagOrderField } from './enums/TagOrderField';
import { DateTime } from './scalars/dateTime';
import { Hello } from './types/hello';
import { Mutation } from './types/mutation';
import { Owner } from './types/owner';
import { PhotoURL } from './types/photoURL';
import { Post } from './types/post';
import { PostConnection } from './types/postConnection';
import { PostTag } from './types/postTag';
import { Query } from './types/query';
import { Tag } from './types/tag';
import { User } from './types/user';

export const resolvers = {
  JSON,
  PostOrderField,
  PostType,
  TagOrderField,
  Mutation,
  Query,
  DateTime,
  Owner,
  PhotoURL,
  Post,
  PostConnection,
  PostTag,
  Tag,
  Hello,
  User
};
