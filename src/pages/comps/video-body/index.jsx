import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/comps/video-body.module.css";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import MenuIcon from "@mui/icons-material/Menu";
import { ref, get } from "firebase/database";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { db } from "../../../../firebase.config";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import FirstHeader from "../first-header";

function VideoShowcase() {
  const [videoSources, setVideoSources] = useState([]);
  const [isLinkClicked, setIsLinkClicked] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLinkClicked(true);
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
          setIsLinkClicked(false);
        } else {
          setVideoSources([]);
          toast.error("Error fetching data");
          setIsLinkClicked(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:", error);
        setVideoSources([]);
        setIsLinkClicked(false);
      }
    };

    fetchData();
  }, []);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <>
      {isLinkClicked && (
        <div className={styles.loadingContainer}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CircularProgress />
            <p style={{ color: "#fff" }}>Loading</p>
          </Box>
        </div>
      )}
      <FirstHeader />

      <div className={styles.videoContainer}>
        <div className={styles.videoContent}>
          <div className={styles.videoContentHeader}>
            <h1>My Videos</h1>
            <h1>Following</h1>
          </div>

          <div className={styles.videoListContainer}>
            <div className={styles.videoListContent}>
              {videoSources.map((data, index) => (
                <div className={styles.videoBox} key={index}>
                  <div className={styles.videoBoxHeader}>
                    <h1>{data?.videoHeader}</h1>
                  </div>

                  <div className={styles.videoBoxVideo}>
                    <object
                      data={data?.videoURL}
                      muted
                      className={styles.object}
                    ></object>
                  </div>

                  <div className={styles.videoBoxVideoDescription}>
                    <div className={styles.videoBoxVideoDescriptionHeader}>
                      <h1>Video Description:</h1>
                    </div>
                    <div className={styles.videoBoxVideoDescriptionText}>
                      <p>
                        {expandedDescriptions[index]
                          ? data?.videoDescription
                          : truncateText(data?.videoDescription, 20)}
                      </p>
                      <p
                        onClick={() => toggleDescription(index)}
                        className={styles.seeMore}
                      >
                        {expandedDescriptions[index] ? "See less" : "See more"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.videoActionsContainer}>
                    <div className={styles.action}>
                      <ThumbUpOffAltIcon className={styles.icon} />
                      <p>{data?.videoLikes}</p>
                    </div>

                    <div className={styles.action}>
                      <CommentIcon className={styles.icon} />
                      <p>{data?.videoComments}</p>
                    </div>

                    <div className={styles.action}>
                      <BookmarksIcon className={styles.icon} />
                      <p>230</p>
                    </div>

                    <div className={styles.action}>
                      <SendIcon className={styles.icon} />
                      <p>{data?.videoShares}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default VideoShowcase;
