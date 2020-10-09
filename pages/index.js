import Head from "next/head";
import Container from "../components/container";
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
      </Head>
      <Container></Container>
    </>
  );
};
export default Index;
