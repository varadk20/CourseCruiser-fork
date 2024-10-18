// src/components/HomePage.js
import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  addCourse as addCourseToFirestore,
  deleteCourse as deleteCourseFromFirestore,
  addToCourse as addToCourseInFirestore,
  removeFromCourse as removeFromCourseInFirestore,
} from "../utils/firestoreHelpers";

import { fetchYouTubeVideos } from "../utils/youtubeAPI";
import VideoPlayer from "./VideoPlayer"; // Import the VideoPlayer component
import "./HomePage.css";

const HomePage = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [courses, setCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [error, setError] = useState(""); // State to handle errors
  const [currentVideo, setCurrentVideo] = useState(null); // To hold the selected video for playing
  const [showVideoPlayer, setShowVideoPlayer] = useState(false); // Controls the visibility of the video player
  const [videoProgress, setVideoProgress] = useState(0); // To track progress of the video

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses || {});
    };

    loadCourses();
  }, []);

  const handleSearch = async () => {
    setError(""); // Reset error message
    try {
      const results = await fetchYouTubeVideos(searchTerm, sortOption);
      setVideos(results);
    } catch (error) {
      setError("Failed to fetch videos. Please try again.");
    }
  };

  const addCourse = async () => {
    if (newCourseName.trim() === "") return;
    await addCourseToFirestore(newCourseName);
    setCourses((prevCourses) => ({
      ...prevCourses,
      [newCourseName]: []
    }));
    setNewCourseName("");
  };

  const deleteCourse = async (courseName) => {
    await deleteCourseFromFirestore(courseName);
    const updatedCourses = { ...courses };
    delete updatedCourses[courseName];
    setCourses(updatedCourses);
  };

  const renameCourse = async (oldName, newName) => {
    if (newName.trim() === "") return;
    const updatedCourses = { ...courses };
    updatedCourses[newName] = updatedCourses[oldName];
    delete updatedCourses[oldName];
    setCourses(updatedCourses);
    // Implement Firestore rename logic if necessary
  };

  const addToCourse = async (courseName, video) => {
    await addToCourseInFirestore(courseName, video);
    setCourses((prevCourses) => ({
      ...prevCourses,
      [courseName]: [...prevCourses[courseName], video]
    }));
  };

  const removeFromCourse = async (courseName, videoId) => {
    await removeFromCourseInFirestore(courseName, videoId);
    setCourses((prevCourses) => ({
      ...prevCourses,
      [courseName]: prevCourses[courseName].filter((video) => video.id !== videoId)
    }));
  };

  // Function to sort videos based on sort option
  const sortVideos = (videos, option) => {
    if (option === "date") {
      return videos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // Assuming you have uploadDate
    } else if (option === "viewCount") {
      return videos.sort((a, b) => b.viewCount - a.viewCount); // Assuming you have viewCount
    }
    return videos; // Default return if no sorting option is selected
  };

  const playVideo = (video) => {
    setCurrentVideo(video); // Set the selected video
    setShowVideoPlayer(true); // Show the video player
    setVideoProgress(0); // Reset the progress for a new video
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false); // Hide the video player
    setCurrentVideo(null); // Clear the selected video
  };

  return (
    <div className="homepage">
      {/* Sidebar for My Courses */}
      <div className="sidebar">
        <h2>My Courses</h2>
        <ul>
          {Object.keys(courses).map((courseName) => (
            <li key={courseName}>
              <span>{courseName}</span>
              <button onClick={() => deleteCourse(courseName)}>Delete</button>
              <button
                onClick={() =>
                  renameCourse(courseName, prompt("Enter new course name:", courseName))
                }
              >
                Rename
              </button>
              <ul>
                {courses[courseName].map((video, index) => (
                  <li key={index} className="course-item">
                    <span onClick={() => playVideo(video)}>{video.title}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCourse(courseName, video.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="add-course">
          <input
            type="text"
            placeholder="New course name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <button onClick={addCourse}>Add Course</button>
        </div>
      </div>

      {/* Main content for search */}
      <div className="main-content">
        <div className="header">
          <h1>Search YouTube</h1>
          <div className="course-selection">
            <label>Select Course: </label>
            <select onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {Object.keys(courses).map((courseName) => (
                <option key={courseName} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search videos or playlists"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="sort-options">
          <label>Sort by: </label>
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Relevance</option>
            <option value="date">Upload Date</option>
            <option value="viewCount">View Count</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>} {/* Display error message */}

        <div className="video-results">
          {sortVideos(videos, sortOption).map((video) => (
            <div key={video.id} className="video-card">
              <img src={video.thumbnail} alt={video.title} />
              <h3>{video.title}</h3>
              <p>{video.type === "video" ? "Video" : "Playlist"}</p>
              <button
                onClick={() => playVideo(video)} // Play video on button click
              >
                Play Video
              </button>
              <button
                onClick={() => addToCourse(selectedCourse, video)}
                disabled={!selectedCourse}
              >
                Add to Course
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player */}
      {showVideoPlayer && currentVideo && (
        <VideoPlayer
          videoId={currentVideo.id}
          progress={videoProgress}
          onClose={closeVideoPlayer}
          onProgressChange={(progress) => setVideoProgress(progress)}
        />
      )}
    </div>
  );
};

export default HomePage;
