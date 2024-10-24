import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  addCourse as addCourseToFirestore,
  deleteCourse as deleteCourseFromFirestore,
  addToCourse as addToCourseInFirestore,
  removeFromCourse as removeFromCourseInFirestore,
} from "../utils/firestoreHelpers";
import { fetchYouTubeVideos } from "../utils/youtubeAPI";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [courses, setCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [error, setError] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses || {});
    };

    loadCourses();
  }, []);

  const handleSearch = async () => {
    setError("");
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

  const sortVideos = (videos, option) => {
    if (option === "date") {
      return videos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } else if (option === "viewCount") {
      return videos.sort((a, b) => b.viewCount - a.viewCount);
    }
    return videos;
  };

  const playVideo = (video) => {
    setCurrentVideo(video);
    setShowVideoPlayer(true);
    setVideoProgress(0);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const goToRecommendations = () => {
    navigate("/recommendations"); // Navigate to the recommendations page
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
            {/* New Recommendations Button */}
            <button className="recommendations" onClick={goToRecommendations} style={{ marginLeft: '10px' }}>
              Recommendations
            </button>
            <button className="logout" onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
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

        {error && <div className="error-message">{error}</div>}

        <div className="video-results">
          {sortVideos(videos, sortOption).map((video) => (
            <div key={video.id} className="video-card">
              <img src={video.thumbnail} alt={video.title} />
              <h3>{video.title}</h3>
              <p>{video.type === "video" ? "Video" : "Playlist"}</p>
              <button onClick={() => playVideo(video)}>
                Play Video
              </button>
              <button onClick={() => addToCourse(selectedCourse, video)} disabled={!selectedCourse}>
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
