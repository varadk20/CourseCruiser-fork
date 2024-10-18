// src/components/VideoPlayer.js
import React, { useState, useEffect } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, onClose, progress, onProgressChange }) => {
  const [player, setPlayer] = useState(null);
  const [hasSeeked, setHasSeeked] = useState(false); // Flag to track if progress has been set
  const [isReady, setIsReady] = useState(false); // Track if the player is fully ready

  useEffect(() => {
    let intervalId;

    // Function to initialize YouTube player
    const onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1, // Auto-play the video
          controls: 1, // Show controls
        },
        events: {
          onReady: (event) => {
            setIsReady(true); // Player is ready
            if (!hasSeeked && progress > 0) {
              event.target.seekTo(progress, true); // Seek to the saved progress
              setHasSeeked(true); // Mark that we've seeked to avoid doing it again
            }
          },
          onStateChange: (event) => {
            // Check if video is playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              intervalId = setInterval(() => {
                if (newPlayer && newPlayer.getCurrentTime) {
                  onProgressChange(newPlayer.getCurrentTime()); // Update progress every second
                }
              }, 1000);
            }
            // Check if video is paused or ended
            else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              clearInterval(intervalId); // Clear interval on pause/stop
            }
          },
        },
      });

      setPlayer(newPlayer); // Set player instance
    };

    // Load YouTube IFrame Player API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    // Cleanup on unmount
    return () => {
      if (player) {
        player.destroy(); // Clean up the player when the component unmounts
      }
      clearInterval(intervalId); // Clear interval to avoid memory leaks
    };
  }, [videoId, progress, onProgressChange, hasSeeked]);

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <div id="youtube-player" className="video-frame"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
