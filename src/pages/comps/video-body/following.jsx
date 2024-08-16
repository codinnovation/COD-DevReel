import React, { useState, useEffect } from "react";
import styles from "../../../styles/comps/following.module.css";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { ref, get, update } from "firebase/database";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { db } from "../../../../firebase.config";
import "react-toastify/dist/ReactToastify.css";
import FirstHeader from "../first-header";
import withSession from "@/lib/session";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

function Following() {
   const router = useRouter()
  const [videoSources, setVideoSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

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

      const likesRef = ref(db, `devReelVideos/${video.currentUser}/${videoKey}/likes`);
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

      const videoRef = ref(db, `devReelVideos/${video.currentUser}/${videoKey}`);
      await update(videoRef, { videoLikes: newLikeCount });
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  return (
    <>
      {isLoading && (
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
            <h1 onClick={() => router.push("/comps/video-body/my-videos")}>My Videos</h1>
            <h1>Following</h1>
          </div>

          <div className={styles.videoListContainer}>
            <div className={styles.videoListContent}>
              {videoSources.map((data, index) => (
                <div className={styles.videoBox} key={data.key || index}>
                  <div className={styles.videoBoxHeader}>
                    <h1>{data?.videoHeader}</h1>
                  </div>

                  <div className={styles.videoBoxVideo}>
                    <video muted controls preload="auto">
                      <source src={data?.videoURL} />
                    </video>
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
                    <div
                      className={styles.action}
                      onClick={() => handleLike(data.key)}
                    >
                      <ThumbUpOffAltIcon className={styles.icon} />
                      <p>{data?.videoLikes}</p>
                    </div>

                    <div className={styles.action}>
                      <CommentIcon className={styles.icon} />
                      <p>{data?.videoComments}</p>
                    </div>

                    <div className={styles.action}>
                      <BookmarksIcon className={styles.icon} />
                      <p>{data?.videoBookmarks}</p>
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
