import { Injectable } from '@angular/core';
import * as LuigiClient from '@kyma-project/luigi-client';
import 'firebase/database';
import 'firebase/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class AppLoadService {

  database: any;
  userId: string;

  init(): Promise<any> {
    const firebaseConfig = {
      apiKey: 'AIzaSyCNiQ3VTATbyL26rkJ6oT2zJH2nVXJZkbo',
      databaseURL: 'https://trip-fc58b.firebaseio.com',
      projectId: 'trip-fc58b',
      storageBucket: 'trip-fc58b.appspot.com',
      messagingSenderId: '720905686784',
      appId: '1:720905686784:web:e7802edf416cde0b832de5'
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    return new Promise((res) => {
      LuigiClient.addInitListener((context) => {
        if (context.idToken) {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            context.idToken);

          firebase.auth().signInWithCredential(credential)
            .then(() => {
              this.database = firebase.database();
              this.userId = firebase.auth().currentUser.uid;
              res();
            })
            .catch((error) => {
              console.error('Couldn\'t sing in to firebase');
            });
        } else {
          res();
        }
      });
    });

  }

}
