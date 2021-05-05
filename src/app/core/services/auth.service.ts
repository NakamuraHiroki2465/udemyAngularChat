import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afauth: AngularFireAuth,
    ) {

  }

  create(email: string, password: string): Promise<void> {
    return this.afauth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        const { user } = credential;
        const actionCodeSettings = {
          url: `http://localhost:4200/?newAccount=true&email=${user.email}`
        }
        credential.user.sendEmailVerification(actionCodeSettings)
      });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential | void>{
    return this.afauth.signInWithEmailAndPassword(email, password)
      .catch(error => console.error(error));
  }

  logout(): Promise<void>{
    return this.afauth.signOut();
  }
}
