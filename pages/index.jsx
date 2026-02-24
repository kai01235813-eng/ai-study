import Head from "next/head";
import App from "../ai-education-app";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#f1f5f9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <App />
    </>
  );
}
