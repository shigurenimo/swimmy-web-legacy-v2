import { Injectable } from '@angular/core';

import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Subject } from 'rxjs/Subject';

import { User as FirestoreUser } from '../interfaces/user';
import { FirebaseService, fromAuth } from './firebase.service';

@Injectable()
export class AuthService {
  private user: Subject<FirestoreUser>;

  constructor(private firebase: FirebaseService) {
  }

  public get auth(): auth.Auth {
    return this.firebase.auth;
  }

  public get currentUser(): User {
    return this.firebase.auth.currentUser;
  }

  public getUser() {
    return this.user;
  }

  public getRedirectResult() {
    const promise = this.firebase.auth.getRedirectResult();

    return fromPromise(promise);
  }

  public signInWithEmailAndPassword(email, password) {
    const promise = this.firebase.auth.signInWithEmailAndPassword(email, password);

    return fromPromise(promise);
  }

  public signInWithFacebookWithRedirect() {
    const provider = new auth.FacebookAuthProvider();
    const promise = this.firebase.auth.signInWithRedirect(provider);

    return fromPromise(promise);
  }

  public signOut() {
    const promise = this.firebase.auth.signOut();

    return fromPromise(promise);
  }

  public authState(): Observable<User> {
    return fromAuth(this.firebase.auth);
  }

  public linkWithFacebookWithPopup() {
    const provider = new auth.FacebookAuthProvider();
    const promise = this.firebase.auth.currentUser.linkWithPopup(provider);

    return fromPromise(promise);
  }

  public linkWithTwitterWithPopup() {
    const provider = new auth.TwitterAuthProvider();
    const promise = this.firebase.auth.currentUser.linkWithPopup(provider);

    return fromPromise(promise);
  }

  public unlink(providerId: string) {
    const promise = this.firebase.auth.currentUser.unlink(providerId);

    return fromPromise(promise);
  }
}
