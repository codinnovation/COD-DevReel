import React from "react";
import styles from "../../styles/login/login.module.css";
import Head from "next/head";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GoogleIcon from "@mui/icons-material/Google";

function Index() {
  return (
    <>
      <Head>
        <title>COD DevReel - Please Login</title>
        <meta name="description" content="Welcome To COD DevReel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <div className={styles.closeIcon}>
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.loginFormContent}>
            <div className={styles.loginHeader}>
              <h1>Log in to COD DevReel</h1>
            </div>

            <div className={styles.loginOptions}>
              <div className={styles.option}>
                <PersonOutlineIcon className={styles.icon} />
                <h1>{`Username, email, Use phone`}</h1>
              </div>

              <div className={styles.option}>
                <GoogleIcon className={styles.icon} />
                <h1>Continue with Google</h1>
              </div>
            </div>

            <div className={styles.createAccount}>
              <p>Don&apos;t have account?</p>
              <p>Sign up</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
