import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/comps/first-header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { push, ref } from "firebase/database";
import { db } from "../../../firebase.config";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function Index() {
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);
  const [isLinkClicked, setIsLinkClicked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openVideoForm, setOpenVideoForm] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);


  // Function to sanitize email
  const sanitizeEmail = (email) => {
    return email.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          const sanitizedEmail = sanitizeEmail(userData.user.email);
          setCurrentUserEmail(sanitizedEmail);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleOpenVideoForm = () => {
    setOpenVideoForm(true);
    handleClose();
  };

  const handleCloseVideoForm = () => {
    setOpenVideoForm(false);
  };

  const [videoForm, setVideoForm] = useState({
    currentUser: "",
    videoTitle: "",
    videoDescription: "",
    videoURL: "",
    videoComments: "",
    videoLikes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm({
      ...videoForm,
      [name]: value,
    });
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();

    if (!videoForm.videoURL) {
      toast.error("Please upload a video.");
      return;
    }

    if (!currentUser) {
      toast.error("User not logged in.");
      return;
    }

    const sanitizedEmail = currentUserEmail;
    const storage = getStorage();
    const videoFile = videoForm.videoURL;
    const videoRef = storageRef(storage, `videos/${videoFile.name}`);

    // Upload video to Firebase Storage
    const uploadTask = uploadBytesResumable(videoRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function, can be used to show progress indicator
      },
      (error) => {
        toast.error("Error uploading video");
        console.error("Upload error:", error);
      },
      async () => {
        // Handle successful upload
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const videoData = {
            ...videoForm,
            videoURL: downloadURL,
            currentUser: sanitizedEmail,
            displayName: currentUser?.user?.displayName,
          };

          // Save video information to Realtime Database
          await push(ref(db, `devReelVideos/${sanitizedEmail}`), videoData);
          toast.success("Video has been successfully uploaded");
          setVideoForm({
            currentUser: sanitizedEmail,
            videoTitle: "",
            videoDescription: "",
            videoURL: "",
            videoComments: "",
            videoLikes: "",
          });
        } catch (error) {
          toast.error("Error saving video data");
          console.error("Database error:", error);
        }
      }
    );
  };

  const handleOpen = () => setOpenProfile(true);
  const handleClose = () => setOpenProfile(false);

  function signinPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/login");
      setIsLinkClicked(false);
    }, 1500);
  }

  const handleLogout = async (e) => {
    setIsLinkClicked(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Logout Successful");
        router.push("/login");
        setIsLinkClicked(false);
      } else {
        toast.error("Logout Failed");
        setIsLinkClicked(false);
      }
    } catch (error) {
      toast.error("Error Occurred");
      setIsLinkClicked(false);
    }
  };

  return (
    <>
      {isLinkClicked && (
        <div className={styles.loadingContainer}>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}

      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.headerName}>
            <h1>{`COD`}</h1>
            <h1>DevReel</h1>
          </div>

          <div className={styles.searchContainer}>
            <input placeholder="search..." />
            <SearchIcon className={styles.icon} />
          </div>

          <div className={styles.userProfile}>
            {currentUser?.user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser?.user?.photoURL}
                className={styles.image}
                alt="profile photo"
                width={900}
                height={900}
                onClick={handleOpen}
                priority
              />
            ) : (
              <div className={styles.defaultProfile}>
                <AccountCircleIcon
                  className={styles.icon}
                  style={{ color: "#fff", fontSize: "50px" }}
                  onClick={() => setOpenProfile(true)}
                />
              </div>
            )}

            <div className={styles.logoutContainer}>
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openProfile}
        onClose={handleClose}
        aria-labelledby="user-profile-modal"
        aria-describedby="modal-to-display-user-profile-details"
      >
        <Box className={styles.modalStyle}>
          <p>{currentUser?.user?.displayName}</p>
          <div className={styles.userButtons}>
            <button onClick={handleOpenVideoForm}>Add Video</button>
            <button>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openVideoForm}
        onClose={handleCloseVideoForm}
        aria-labelledby="user-profile-modal"
        aria-describedby="modal-to-display-user-profile-details"
      >
        <Box className={styles.modalStyle}>
          <h2 id="user-profile-modal">Add Video</h2>
          <div className={styles.videoFormContainer}>
            <div className={styles.field}>
              <input
                placeholder="Video Header"
                name="videoHeader"
                value={videoForm.videoHeader}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field}>
              <input
                placeholder="Video Description"
                value={videoForm.videoDescription}
                name="videoDescription"
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field}>
              <input
                type="file"
                accept="video/*"
                name="videoURL"
                onChange={(e) =>
                  setVideoForm({ ...videoForm, videoURL: e.target.files[0] })
                }
              />
            </div>

            <button onClick={handleSubmitVideo}>Submit</button>
          </div>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default Index;
