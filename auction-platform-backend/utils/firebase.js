// utils/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
  storageBucket: 'your-project-id.appspot.com' // Replace with your Firebase project storage bucket
});

module.exports = admin;
