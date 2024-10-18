// src/utils/firestoreHelpers.js
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteField } from "firebase/firestore"; // Ensure deleteField is imported
import { db, auth } from "../firebase"; // Ensure Firebase is correctly imported

// Function to add a course
export const addCourse = async (courseName) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    await updateDoc(courseRef, {
      [`courses.${courseName}`]: [] // Initialize with an empty array
    });
  }
};

// Function to fetch courses
export const fetchCourses = async () => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    const courseSnap = await getDoc(courseRef);
    return courseSnap.exists() ? courseSnap.data().courses : {};
  }
  return {};
};

// Function to remove a video from a course
export const removeFromCourse = async (courseName, video) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    await updateDoc(courseRef, {
      [`courses.${courseName}`]: arrayRemove(video) // Remove the video
    });
  }
};

// Function to delete a course
export const deleteCourse = async (courseName) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    await updateDoc(courseRef, {
      [`courses.${courseName}`]: deleteField() // Remove the course
    });
  }
};

// Rename a course
export const renameCourse = async (oldCourseName, newCourseName) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    await updateDoc(courseRef, {
      [`courses.${newCourseName}`]: arrayUnion(...(await getCoursesArray(oldCourseName))),
      [`courses.${oldCourseName}`]: deleteField() // Remove the old course
    });
  }
};

// Helper function to get the array of videos for a specific course
const getCoursesArray = async (courseName) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      return courseSnap.data().courses[courseName] || [];
    }
  }
  return [];
};

// Add to a course
export const addToCourse = async (courseName, video) => {
  const user = auth.currentUser;
  if (user) {
    const courseRef = doc(db, "users", user.uid);
    await updateDoc(courseRef, {
      [`courses.${courseName}`]: arrayUnion(video) // Add the video or playlist
    });
  }
};

// ... other functions ...
export const saveProgressToFirestore = async (userId, videoId, progress) => {
    const docRef = doc(db, "userProgress", userId);
    await setDoc(docRef, { [videoId]: progress }, { merge: true });
  };
  
  // Get user progress
  export const getProgressFromFirestore = async (userId, videoId) => {
    const docRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data()[videoId] || 0; // Return progress for the specific video or 0 if not found
    }
    return 0; // No progress found
  };
