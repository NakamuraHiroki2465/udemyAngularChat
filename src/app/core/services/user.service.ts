import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afauth: AngularFireAuth,
    private db: AngularFireDatabase
  ) { }
  create(email: string, password: string): Promise<void> {
    return this.afauth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        const { user } = credential;
        const actionCodeSettings = {
          url: `http://localhost:4200/?newAccount=true&email=${user.email}`
        }
        credential.user.sendEmailVerification(actionCodeSettings)

        this.db.object(`users/${user.uid}`).set(new User(user));
      });
  }

  update(values: { displayName?: string, photoURL?: string }): Promise<void> {
    return this.afauth.currentUser.then((user: firebase.User | null) =>{
      if (user) {
        user.updateProfile(values)
          .then(()=> this.db.object(`/users/${user.uid}`).update(values))
          .catch(error => console.error(error));
      }
    })
  }
}
