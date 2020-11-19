import React from "react";
import Head from "next/head";
import Schedule from "../components/main/Schedule";
const calendar = () => {
  return (
    <>
      <Head>
        <title>Calendar</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Schedule />
    </>
  );
};

export default calendar;
