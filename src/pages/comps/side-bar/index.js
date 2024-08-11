import React from "react";
import styles from "../../../styles/comps/side-bar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonIcon from "@mui/icons-material/Person";

function Index() {
  return (
    <>
      <div className={styles.sideContainer}>
        <div className={styles.sideContent}>
          <div className={styles.links}>
            <div className={styles.linkContainer}>
              <HomeIcon className={styles.icon} />
              <h1>For You</h1>
            </div>

            <div className={styles.linkContainer}>
              <Diversity3Icon className={styles.icon} />
              <h1>Following</h1>
            </div>

            <div className={styles.linkContainer}>
              <PersonIcon className={styles.icon} />
              <h1>Followers</h1>
            </div>

            <div className={styles.linkContainer}>
              <PersonIcon className={styles.icon} />
              <h1>Followers</h1>
            </div>

            <div className={styles.linkContainer}>
              <PersonIcon className={styles.icon} />
              <h1>Followers</h1>
            </div>
          </div>
          <div className={styles.sideButton}>
            <button>Login / Sign up</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
