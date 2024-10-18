// src/utils/youtubeAPI.js
import axios from "axios";
 
const API_KEY = process.env.REACT_APP_yt_API_KEY; // Replace with your YouTube API key

export const fetchYouTubeVideos = async (searchTerm, sortOption) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video,playlist&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Filter out shorts and structure the results
    const filteredResults = data.items
      .filter((item) => item.id.kind === "youtube#video" || item.id.kind === "youtube#playlist")
      .map((item) => ({
        id: item.id.kind === "youtube#video" ? item.id.videoId : item.id.playlistId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        type: item.id.kind === "youtube#video" ? "Video" : "Playlist",
        // You might need to fetch additional details if you want view count or upload date
      }));

    // Sort logic could be implemented here based on your needs
    // Example: filteredResults.sort((a, b) => b.title.localeCompare(a.title));

    return filteredResults;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw new Error("Failed to fetch videos from YouTube API");
  }
};
