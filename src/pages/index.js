import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import withSession from "@/lib/session";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/my-videos");
    }, 3000);
  }, [router]);

  return (
    <>
      <Head>
        <title>Welcome To COD DevReel</title>
        <meta name="description" content="Welcome To COD DevReel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-w-2.png" />
      </Head>
      <main className={styles.imageWrapper}>
        <Image
          src="/logo-2.png" // Replace with your image path
          alt="COD DevReel"
          className={styles.pop}
          width={900}
          height={900}
        />

        <p>DevReel</p>
      </main>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  const currentPath = req ? req.url : window.location.pathname;
  if (!user) {
    return {
      redirect: {
        destination: `/login?r=1&redirect=${currentPath}`,
        permanent: false,
      },
    };
  }

  if (user) {
    req.session.set("user", user);
    await req.session.save();
  }

  return {
    props: {
      user: user,
    },
  };
});
