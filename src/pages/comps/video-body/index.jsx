import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/comps/video-body.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import MenuIcon from "@mui/icons-material/Menu";
import { ref, get } from "firebase/database";
import { db } from "../../../../firebase.config";

function VideoShowcase() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoSources, setVideoSources] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db, "devReelVideos");
        const response = await get(dbRef);
        const data = response.val();

        if (data && typeof data === "object") {
          const dataArray = Object.entries(data).map(([key, value]) => ({
            key,
            ...value,
          }));
          setVideoSources(dataArray);
        } else {
          setVideoSources([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVideoSources([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideoIndex]);

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex < videoSources.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : videoSources.length - 1
    );
  };

  return (
    <div className={styles.videoContainer}>
      {videoSources.length > 0 && (
        <div className={styles.videoContent}>
          <div className={styles.navigateButtons}>
            <KeyboardArrowUpIcon
              className={styles.navBtn2}
              onClick={handlePrevVideo}
            />
            <KeyboardArrowDownIcon
              className={styles.navBtn1}
              onClick={handleNextVideo}
            />
          </div>

          <div className={styles.videoBody}>
            <video
              ref={videoRef}
              className={styles.video}
              controls
              autoPlay
              muted
            >
              <source src={videoSources[currentVideoIndex].videoURL} />
            </video>
            <div className={styles.menuIcon}>
              <MenuIcon className={styles.icon} />
            </div>
          </div>

          <div className={styles.videoActions}>
            <div className={styles.videoBox}>
              <div className={styles.videoBoxDetails}>
                <div className={styles.videoBoxHeader}>
                  <h1>{videoSources[currentVideoIndex].videoHeader}</h1>
                </div>

                <div className={styles.videoBoxDes}>
                  <p>{videoSources[currentVideoIndex].videoDescription}</p>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <div className={styles.action}>
                <CommentIcon className={styles.icon} />
                <div className={styles.des}>
                  <p>345</p>
                  <p>Comments</p>
                </div>
              </div>

              <div className={styles.action}>
                <ThumbUpOffAltIcon className={styles.icon} />
                <div className={styles.des}>
                  <p>45</p>
                  <p>Likes</p>
                </div>
              </div>

              <div className={styles.action}>
                <BookmarksIcon className={styles.icon} />
                <div className={styles.des}>
                  <p>0</p>
                  <p>Saved</p>
                </div>
              </div>

              <div className={styles.action}>
                <SendIcon className={styles.icon} />
                <div className={styles.des}>
                  <p>3</p>
                  <p>Shares</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoShowcase;
