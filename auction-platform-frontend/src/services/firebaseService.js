// src/services/firebaseService.js
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const storage = getStorage();
const auth = getAuth();

// Function to upload image to Firebase Storage
export const uploadImage = async (file) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Create a reference to the file in Firebase Storage
  const storageRef = ref(storage, `images/${user.uid}/${file.name}`);

  // Upload file to Firebase
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Return a promise to get the download URL once the upload is complete
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optional: You can track upload progress here
      },
      (error) => {
        reject(error);
      },
      () => {
        // Get the download URL after the upload is completed
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL); // Resolve with the URL of the uploaded image
          })
          .catch((error) => reject(error));
      }
    );
  });
};
