// Firebase client-side SDK configuration placeholder.
// In a production build, install 'firebase' NPM package and configure credentials.

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Simulated cloud synchronization interface
export const db = {
  collection: (name: string) => {
    console.log(`Firestore simulated collection: ${name}`);
    return {
      add: async (data: any) => {
        console.log(`Firestore simulated add to ${name}:`, data);
        return { id: 'mock-doc-' + Math.random().toString(36).substr(2, 9) };
      },
      get: async () => {
        console.log(`Firestore simulated fetch from ${name}`);
        return { docs: [] };
      }
    };
  }
};

export const auth = {
  currentUser: {
    uid: 'mock-uid-sreekar',
    displayName: 'Sreekar',
    email: 'sreekar@tpsreekar37.com'
  },
  signInWithEmail: async () => {
    console.log("Simulated sign in");
    return { user: { uid: 'mock-uid-sreekar' } };
  },
  signOut: async () => {
    console.log("Simulated sign out");
  }
};
