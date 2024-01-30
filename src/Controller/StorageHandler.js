import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default class StorageHandler {
  constructor(setErrorMessage) {
    this.setErrorMessage = setErrorMessage;
  }

  //upload photo
  //return url
  postPhoto = async (uid, file) => {
    const photoRef = ref(storage, `profilePics/${uid}.jpg`);
    try {
      await uploadBytes(photoRef, file);
      const url = await getDownloadURL(photoRef);
      return url;
    } catch (error) {
      this.setErrorMessage(error.message);
    }
  };
}
