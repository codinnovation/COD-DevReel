import React, { useState, useEffect } from "react";
import styles from "../../styles/signup/signup.module.css";
import Head from "next/head";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { googleProvider, auth } from "../../../firebase.config";
import { signInWithPopup } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import withSession from "@/lib/session";

function Index() {
  const router = useRouter();
  const [isLinkClicked, setIsLinkClicked] = useState(false);

  function SigUpWithEmailPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/sign-up/email");
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

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Send user data to the API route to set the session
      const response = await fetch("/api/googleprovider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      });
  
      if (response.ok) {
        toast.success("Account created successfully");
        router.push("/");
      } else {
        throw new Error("Failed to set session");
      }
    } catch (error) {
      console.error("Error signing up with Google:", error);
      toast.error("Error creating account");
    }
  };
  

  return (
    <>
      <ToastContainer />
      {isLinkClicked && (
        <div className={styles.loadingContainer}>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}

      <Head>
        <title>COD DevReel - Please Create Account</title>
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
              <h1>Create Your Account</h1>
            </div>

            <div className={styles.loginOptions}>
              <div className={styles.option} onClick={SigUpWithEmailPage}>
                <PersonOutlineIcon className={styles.icon} />
                <h1>{`Username / email`}</h1>
              </div>

              <div className={styles.option} onClick={signUpWithGoogle}>
                <GoogleIcon className={styles.icon} />
                <h1>Continue with Google</h1>
              </div>
            </div>

            <div className={styles.createAccount}>
              <p>Already have an account?</p>
              <p onClick={signinPage}>Log in</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
