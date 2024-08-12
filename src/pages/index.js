import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Comps from '../pages/comps'
import withSession from "@/lib/session";

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome To COD DevReel</title>
        <meta name="description" content="Welcome To COD DevReel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Comps/>
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
