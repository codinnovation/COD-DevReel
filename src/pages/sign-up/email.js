import React, { useState, useEffect } from "react";
import styles from "../../styles/signup/email.module.css";
import Head from "next/head";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Email() {
  const router = useRouter();
  const [isLinkClicked, setIsLinkClicked] = useState(false);

  function signUpPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/sign-up/");
      setIsLinkClicked(false);
    }, 1500);
  }

  function signinPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/login");
      setIsLinkClicked(false);
    }, 1500);
  }

  function forgetPassword() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/forget-password");
      setIsLinkClicked(false);
    }, 1500);
  }

  return (
    <>
      {isLinkClicked && (
        <div className={styles.loadingContainer}>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}

      <Head>
        <title>COD DevReel - Create with Email</title>
        <meta name="description" content="Welcome To COD DevReel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <div className={styles.closeIcon}>
            <ArrowBackIosIcon
              className={styles.iconArrow}
              onClick={signUpPage}
            />
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.loginFormContent}>
            <div className={styles.loginHeader}>
              <h1>Sign up</h1>
            </div>

            <div className={styles.loginForm}>
              <form>
                <div className={styles.inputField}>
                  <label>Email Address</label>
                  <input type="email" placeholder="example@gmail.com" />
                </div>

                <div className={styles.inputField}>
                  <label>Password</label>
                  <input type="password" placeholder="password" />
                </div>

                <div className={styles.forgetPassword}>
                  <p onClick={forgetPassword}>Forget Password</p>
                </div>

                <div className={styles.loginButton}>
                  <button>Create</button>
                </div>

                <div className={styles.createAccount}>
                  <p>Already have an account?</p>
                  <p onClick={signinPage}>Log in</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Email;
