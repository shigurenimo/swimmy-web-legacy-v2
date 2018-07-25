import { Injectable } from '@angular/core';

import { HttpsCallableResult } from '@firebase/functions-types';
import { auth, User } from 'firebase/app';
import { from, Observable, Subject } from 'rxjs';

import { User as FirestoreUser } from '../interfaces/user';
import { FirebaseService, fromAuth } from './firebase.service';

@Injectable()
export class AuthService {
  private user: Subject<FirestoreUser>;

  constructor(private firebaseService: FirebaseService) {
  }

  public get auth() {
    return this.firebaseService.auth;
  }

  public get currentUser(): User {
    return this.firebaseService.auth().currentUser;
  }

  public getUser() {
    return this.user;
  }

  public getRedirectResult() {
    return from(this.firebaseService.auth().getRedirectResult());
  }

  public createUserWithEmailAndPassword(email, password) {
    return from(this.firebaseService.auth().createUserWithEmailAndPassword(email, password));
  }

  public signInWithEmailAndPassword(email, password) {
    return from(this.firebaseService.auth().signInWithEmailAndPassword(email, password));
  }

  public signInWithFacebookWithRedirect() {
    const provider = new auth.FacebookAuthProvider();

    return from(this.firebaseService.auth().signInWithRedirect(provider));
  }

  public updatePassword(password: string) {
    return from(this.firebaseService.auth().currentUser.updatePassword(password));
  }

  public reauthenticateWithCredential(credential) {
    return from(this.firebaseService.auth().currentUser.reauthenticateWithCredential(credential));
  }

  public signOut() {
    return from(this.firebaseService.auth().signOut());
  }

  public authState(): Observable<User> {
    return fromAuth(this.firebaseService.auth());
  }

  public linkWithFacebookWithPopup() {
    const provider = new auth.FacebookAuthProvider();

    return from(this.firebaseService.auth().currentUser.linkWithPopup(provider));
  }

  public linkWithTwitterWithPopup() {
    const provider = new auth.TwitterAuthProvider();

    return from(this.firebaseService.auth().currentUser.linkWithPopup(provider));
  }

  public updateEmail(newEmail: string) {
    return from(this.firebaseService.auth().currentUser.updateEmail(newEmail));
  }

  public unlink(providerId: string) {
    return from(this.firebaseService.auth().currentUser.unlink(providerId));
  }

  public restoreUser(data: { username: string, password: string }): Observable<HttpsCallableResult> {
    const func = this.firebaseService.functions().httpsCallable('restoreUser');

    return from(func(data));
  }
}
