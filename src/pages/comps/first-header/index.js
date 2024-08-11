import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/comps/first-header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { NineKPlusOutlined } from "@mui/icons-material";

function Index() {
  const [openProfile, setOpenProfile] = useState(false);
  const [isLinkClicked, setIsLinkClicked] = useState(false);
  const [currentUser, setCurrentUser] = useState(NineKPlusOutlined);
  const router = useRouter()

  console.log("current", currentUser)
  const handleOpen = () => setOpenProfile(true);
  const handleClose = () => setOpenProfile(false);

  function signinPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/login");
      setIsLinkClicked(false);
    }, 1500);
  }

  useEffect(() => {
   const fetchUser = async () => {
     try {
       const response = await fetch("/api/user");
       if (response.ok) {
         const userData = await response.json();
         setCurrentUser(userData);
       } 
     } catch (error) {
       console.error("Error fetching user data:", error);
     }
   };

   fetchUser();
 }, []);

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
            <img
              src={currentUser?.user?.user?.photoURL }
              className={styles.image}
              alt="profile photo"
              width={900}
              height={900}
              onClick={handleOpen}
            />
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
          <h2 id="user-profile-modal">User Profile</h2>
          <div className={styles.userButtons}>
            <button>Profile</button>
            <button>Settings</button>
            <button onClick={signinPage}>Login</button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Index;
