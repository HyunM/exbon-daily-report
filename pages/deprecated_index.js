import Head from "next/head";
import Container from "../components/container";
import SignIn from ".";
import useSwr from "swr";
import Link from "next/link";

// const fetcher = url => fetch(url).then(res => res.json());

const Index = () => {
  // const dataOfTimesheet = useSwr(
  //   "/api/timesheets?selectedDate=2020-10-05",
  //   fetcher
  // ).data;
  return (
    <>
      <Head>
        <title>Daily Report</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* <SignIn /> */}
      <Container></Container>
      <div id="modalForTasksTab"></div>
    </>
  );
};

export default Index;
