import { Injectable } from '@angular/core';

import { auth, User } from 'firebase/app';
import { from, Observable, Subject } from 'rxjs';

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
    return from(this.firebase.auth.getRedirectResult());
  }

  public signInWithEmailAndPassword(email, password) {
    return from(this.firebase.auth.signInWithEmailAndPassword(email, password));
  }

  public signInWithFacebookWithRedirect() {
    const provider = new auth.FacebookAuthProvider();

    return from(this.firebase.auth.signInWithRedirect(provider));
  }

  public signOut() {
    return from(this.firebase.auth.signOut());
  }

  public authState(): Observable<User> {
    return fromAuth(this.firebase.auth);
  }

  public linkWithFacebookWithPopup() {
    const provider = new auth.FacebookAuthProvider();

    return from(this.firebase.auth.currentUser.linkWithPopup(provider));
  }

  public linkWithTwitterWithPopup() {
    const provider = new auth.TwitterAuthProvider();

    return from(this.firebase.auth.currentUser.linkWithPopup(provider));
  }

  public unlink(providerId: string) {
    return from(this.firebase.auth.currentUser.unlink(providerId));
  }
}
