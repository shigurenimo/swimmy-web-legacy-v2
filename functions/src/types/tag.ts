import { Tag } from '../interfaces/tag';

export type TagId = string;

export type Tags = Tag[] | { [key: string]: Tag };
