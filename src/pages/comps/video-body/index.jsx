import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/comps/video-body.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function VideoShowcase() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1);
  const [value, setValue] = React.useState(0);
  const videoSources = ["/video2.mp4", "/video.mp4", "/video3.mp4"];
  const videoRef = useRef(null); // Reference to the video element

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videoSources.length) % videoSources.length
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video element to reflect the new source
    }
  }, [currentVideoIndex]);

  return (
    <>
      <div className={styles.videoContainer}>
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
              <source src={videoSources[currentVideoIndex]} />
            </video>
            <div className={styles.menuIcon}>
              <MenuIcon className={styles.icon} />
            </div>
          </div>

          <div className={styles.videoActions}>
            <div className={styles.videoBox}>
              <div className={styles.videoBoxDetails}>
                <div className={styles.videoBoxHeader}>
                  <h1>Building E-Commerce Website</h1>
                </div>

                <div className={styles.videoBoxDes}>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum. laboris nisi ut aliquip
                    ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum. laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                  </p>
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
      </div>
      {/* <div className={styles.menuNavigations}>
        <Box sx={{ width: "auto", margin: "0px", padding: "0" }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
          
            <BottomNavigationAction
              label="Next"
              icon={<KeyboardArrowUpIcon />}
              onClick={handlePrevVideo}
            />
            <BottomNavigationAction
              label="Prev"
              icon={<KeyboardArrowDownIcon />}
              onClick={handleNextVideo}
            />
          </BottomNavigation>
        </Box>
      </div> */}
    </>
  );
}

export default VideoShowcase;
