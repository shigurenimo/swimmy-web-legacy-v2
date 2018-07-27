import { Injectable } from '@angular/core';

import { DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';

import { toArray } from '../helpers/toArray';
import { Post } from '../interfaces/post';

@Injectable()
export class SnapshotService {
  public toDocDataFromQueryDocSnapshot<T>(doc: QueryDocumentSnapshot | DocumentSnapshot): T {
    return doc.exists
      ? doc.data() as T
      : null;
  }

  public toDocsDataFromQueryDocSnapshots<T>(docs: QueryDocumentSnapshot[]): T[] {
    return docs.map<T>(this.toDocDataFromQueryDocSnapshot);
  }

  public toPostDataFromQueryDocSnapshot(doc: QueryDocumentSnapshot | DocumentSnapshot): Post {
    const data = doc.data();
    return doc.exists
      ? {
        ...data,
        photoURLs: toArray(data.photoURLs).map(photoURL => photoURL.photoURL),
        tags: toArray(data.tags),
      } as Post
      : null;
  }

  public toPostsDataFromQueryDocSnapshots(docs: QueryDocumentSnapshot[]): Post[] {
    return docs.map<Post>(this.toPostDataFromQueryDocSnapshot);
  }

  public toPostsDataFromQuerySnapshot(querySnapshot: QuerySnapshot): Post[] {
    return this.toPostsDataFromQueryDocSnapshots(querySnapshot.docs);
  }
}
