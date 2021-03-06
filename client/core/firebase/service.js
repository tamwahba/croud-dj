import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
});
