import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// These values are meant to be public. What protects your data is the rules in firestore.rules.
const firebaseConfig = {
  apiKey: 'AIzaSyCTjChOzUM3BwC9YvcYBb_gpUTDUdNlvJY',
  authDomain: 'pictureswebsite-c916d.firebaseapp.com',
  projectId: 'pictureswebsite-c916d',
  storageBucket: 'pictureswebsite-c916d.firebasestorage.app',
  messagingSenderId: '147100889241',
  appId: '1:147100889241:web:746ba5b7183d5b6fc60808',
};

// If the placeholder project id is ever put back, the Guestbook shows a "not set up yet" message instead of crashing.
export const firebaseReady = firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
export const db = firebaseReady ? getFirestore(initializeApp(firebaseConfig)) : null;