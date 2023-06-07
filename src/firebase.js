// Import the functions you need from the SDKs you need
import { ref, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, remove } from "firebase/database";
import { getStorage, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";

const DB_REVIEWS_KEY = "reviews";
const DB_MOVIES_KEY = "movies";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_REALTIME_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);

export async function upload(file, user, setLoading){
  const fileRef = ref(storage, user.uid + '.png')

  setLoading(true)

  const snapshot = await uploadBytes(fileRef, file)
  const photoURL = await getDownloadURL(fileRef)

  await updateProfile( user,  {photoURL: photoURL})
  console.log(user.photoURL)
  setLoading(false)
  alert('Profile Picture Updated!')
}

export async function setUserName(userName, user, setLoading){
  setLoading(true)
  await updateProfile( user,  {displayName: userName})
  setLoading(false)
}

export async function setDefaultPFP(photoURL, user, setLoading){
  setLoading(true)
  await updateProfile( user,  {photoURL: photoURL})
  setLoading(false)
}

export async function retrievePFP(userId, setPhotoURL){
  const fileRef = ref(storage, userId + '.png')

  const photoURL = await getDownloadURL(fileRef).then((pfpURL)=>{
    setPhotoURL(pfpURL)
  })
}

export async function deleteMovieReview(reviewRef, checkMovieDatabase){
  await remove(reviewRef)
  console.log('item deleted')
  checkMovieDatabase();
}
