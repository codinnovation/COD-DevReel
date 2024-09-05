import React, { useState, useEffect } from "react";
import styles from '@/styles/comps/following.module.css';
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import DownloadIcon from "@mui/icons-material/Download";
import { ref, get, update } from "firebase/database";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { db } from "../../firebase.config";
import "react-toastify/dist/ReactToastify.css";
import FirstHeader from "./first-header";
import withSession from "@/lib/session";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



function Following() {
  const router = useRouter();
  const [videoSources, setVideoSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);


  // Function to sanitize email
  const sanitizeEmail = (email) => email?.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setCurrentUserEmail(sanitizeEmail(userData?.user?.email));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db, `devReelVideos`);
        const response = await get(dbRef);
        const data = response.val();

        if (data && typeof data === "object") {
          const dataArray = Object.entries(data).flatMap(([key, value]) => {
            return Object.entries(value).map(([subKey, subValue]) => ({
              key: subKey,
              ...subValue,
            }));
          });

          // Filter out videos where the currentUserEmail matches the one in the video data
          const filteredVideos = dataArray.filter(
            (video) => video.currentUser !== currentUserEmail
          );

          setVideoSources(filteredVideos);
        } else {
          setVideoSources([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVideoSources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserEmail]);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}...`
      : text;
  };

  const handleLike = async (videoKey) => {
    try {
      const video = videoSources.find((v) => v.key === videoKey);
      if (!video) return;

      const likesRef = ref(
        db,
        `devReelVideos/${video.currentUser}/${videoKey}/likes`
      );
      const likesSnapshot = await get(likesRef);
      const likesData = likesSnapshot.val() || {};

      if (likesData[currentUserEmail]) {
        toast.error("You've already liked this video");
        return;
      }

      const newLikeCount = (video.videoLikes || 0) + 1;

      setVideoSources((prev) =>
        prev.map((v) =>
          v.key === videoKey ? { ...v, videoLikes: newLikeCount } : v
        )
      );

      await update(likesRef, { [currentUserEmail]: true });

      const videoRef = ref(
        db,
        `devReelVideos/${video.currentUser}/${videoKey}`
      );
      await update(videoRef, { videoLikes: newLikeCount });
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex < videoSources.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : videoSources.length - 1
    );
  };

  const currentVideo = videoSources[currentVideoIndex];

  return (
    <>
    {isLoading && (
      <div className={styles.loadingContainer}>
        <Box>
          <CircularProgress />
          <p style={{ color: "#fff" }}>Loading Videos</p>
        </Box>
      </div>
    )}
    <FirstHeader />
    <div className={styles.videoContainer}>
      <div className={styles.videoContent}>
        <div className={styles.videoContentHeader}>
          <h1 onClick={() => router.push("/my-videos")}>My Videos</h1>
          <h1>Following</h1>
        </div>

        <div className={styles.videoListContainer}>
          {currentVideo && (
            <div className={styles.videoListContent} key={currentVideo.key}>
              <div className={styles.videoNavigation}>
                <div className={styles.arrowButton} onClick={handlePreviousVideo}>
                  <ArrowBackIcon className={styles.icon} />
                </div>

                <div className={styles.arrowButton} onClick={handleNextVideo}>
                  <ArrowForwardIcon className={styles.icon} />
                </div>
              </div>

              <div className={styles.videoBodyContainer}>
                <video
                  src={currentVideo.videoURL}
                  controls
                  autoPlay
                  loop
                  playsInline
                  muted
                />
              </div>

              <div className={styles.videoActionsContainer}>
                <div className={styles.action} onClick={() => handleLike(currentVideo.key)}>
                  <ThumbUpOffAltIcon className={styles.icon} />
                  <p>{currentVideo.videoLikes || 0} Likes</p>
                </div>

                <div className={styles.action}>
                  <CommentIcon className={styles.icon} />
                  <p>{currentVideo.videoComments || 0} Comments</p>
                </div>

                <div className={styles.action}>
                  <DownloadIcon className={styles.icon} />
                </div>
              </div>
              <div className={styles.videoDescriptions}>
                  <div className={styles.videoDescriptionsHeader}>
                    <h1>{currentVideo?.videoHeader}</h1>
                  </div>

                  <div className={styles.videoDescriptionsText}>
                    <p>{currentVideo?.videoDescription}</p>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <ToastContainer />
  </>
  );
}

export default Following;

export const getServerSideProps = withSession(async ({ req, res }) => {
  const user = req.session.get("user");
  const currentPath = req.url || "/";
  if (!user) {
    return {
      redirect: {
        destination: `/login?r=1&redirect=${currentPath}`,
        permanent: false,
      },
    };
  }

  req.session.set("user", user);
  await req.session.save();

  return {
    props: { user },
  };
});
