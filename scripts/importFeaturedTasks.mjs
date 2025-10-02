// scripts/importFeaturedTasks.mjs
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import 'dotenv/config';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Build config from .env (same keys Vite uses)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Resolve path to public/featuredTasks.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonPath = resolve(__dirname, '../public/featuredTasks.json');

// Load JSON
const raw = await readFile(jsonPath, 'utf-8');
const featuredTasks = JSON.parse(raw);

async function uploadTasks() {
  let ok = 0, fail = 0;
  for (const task of featuredTasks) {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        featured: true,
        createdAt: serverTimestamp(),
        status: task.status || 'open',
      });
      ok++;
      console.log(`Uploaded: ${task.title || task.id}`);
    } catch (err) {
      fail++;
      console.error('Upload failed:', task.title || task.id, err.message);
    }
  }
  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
}

uploadTasks().then(() => process.exit(0));
