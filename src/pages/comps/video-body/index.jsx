import React, { useState } from "react";
import styles from "../../../styles/comps/video-body.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from '@mui/icons-material/Comment';

// Dummy video sources for demonstration
const videoSources = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];

function VideoShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videoSources.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videoSources.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoContent}>
        <div className={styles.videoSource}>
          <video className={styles.video} controls>
            <source src="/video2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.videoActions}>
          <div className={styles.videoActionsContainer}>
            <div className={styles.action}>
              <FavoriteBorderIcon />
              <p>778k Likes</p>
            </div>

            <div className={styles.action}>
              <CommentIcon />
              <p>230 Comments</p>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default VideoShowcase;
