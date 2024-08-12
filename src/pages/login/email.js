import React, { useState, useEffect } from "react";
import styles from "../../styles/login/email.module.css";
import Head from "next/head";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function Email() {
  const router = useRouter();
  const [isLinkClicked, setIsLinkClicked] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  function loginPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/login/");
      setIsLinkClicked(false);
    }, 1500);
  }

  function createAccountPage() {
    setIsLinkClicked(true);
    setTimeout(() => {
      router.push("/sign-up");
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLinkClicked(true);

    let data = {
      email: userDetails.email,
      password: userDetails.password,
    };

    try {
      const response = await fetch("/api/email-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Log in successfully");
        setIsLinkClicked(false);
        console.log(response)

      } else {
        setIsLinkClicked(false);
        toast.error("Error Log in account");
        console.log(response)
      }
    } catch (err) {
      toast.error("Error Log in account", err.message);
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

      <Head>
        <title>COD DevReel - Login with Email</title>
        <meta name="description" content="Welcome To COD DevReel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <div className={styles.closeIcon}>
            <ArrowBackIosIcon
              className={styles.iconArrow}
              onClick={loginPage}
            />
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.loginFormContent}>
            <div className={styles.loginHeader}>
              <h1>Log in</h1>
            </div>

            <div className={styles.loginForm}>
              <form onSubmit={handleLogin}>
                <div className={styles.inputField}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.inputField}>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleInputChange}
                  />                </div>

                <div className={styles.forgetPassword}>
                  <p onClick={forgetPassword}>Forget Password</p>
                </div>

                <div className={styles.loginButton}>
                  <button>Login</button>
                </div>

                <div className={styles.createAccount}>
                  <p>Don&apos;t have account?</p>
                  <p onClick={createAccountPage}>Sign up</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
}

export default Email;
