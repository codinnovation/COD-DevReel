import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Comps from '../pages/comps'

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
