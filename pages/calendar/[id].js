import React from "react";
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import styles from "../calendar.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import axios from "axios";
import { formatDate } from "../../components/main/formatDate";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
const calendar = () => {
  const handleEventPositioned = info => {
    info.el.setAttribute(
      "data-tip",
      "Project ID : " +
        info.event._def.extendedProps.ProjectID +
        "<br/>" +
        "Project Name : " +
        info.event._def.extendedProps.ProjectName +
        "<br/>" +
        "Position : " +
        info.event._def.extendedProps.EmployeePosition +
        "<br/>" +
        "Start Date : " +
        formatDate(info.event._instance.range.start) +
        "<br/>" +
        "End Date : " +
        formatDate(info.event._instance.range.end)
    );

    ReactTooltip.rebuild();
  };
  const [data, setData] = useState(() => []);
  const router = useRouter();
  const { query = {} } = router || {};
  const { id = 0 } = query || {};

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/calendar/${id}`,
        timeout: 15000, // 15 seconds timeout
        headers: {},
      });
      setData(result.data);
    };
    trackPromise(fetchData());
  }, [id]);

  const { promiseInProgress } = usePromiseTracker();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div className={styles["toolbar__wrapper"]}>
            <div className={styles["toolbar__wrapper__left"]}>
              <Typography variant="h5">Schedule</Typography>
            </div>
            <div className={styles["toolbar__wrapper__right"]}>
              <Typography variant="h6">
                {typeof data[0] === "object" ? data[0].EmployeeName : ""}
              </Typography>
              <AccountCircle
                className={styles["toolbar__wrapper__right__account-icon"]}
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <div className={styles["frame"]}>
        {console.log(data)}

        {promiseInProgress || id === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
          </div>
        ) : (
          <>
            <FullCalendar
              plugins={[dayGridPlugin]}
              height="750px"
              initialView="dayGridMonth"
              eventColor="#ffffff"
              events={data}
              dayMaxEventRows={5}
              eventTextColor="white"
              displayEventTime={false}
              eventDidMount={handleEventPositioned}
            />
            <ReactTooltip multiline={true} type="info" offset={{ right: 50 }} />
          </>
        )}
      </div>
    </>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { id: "*" } }],
//     fallback: true,
//   };
// }

// export async function getStaticProps(context) {
//   // const res = await fetch("https://.../posts");
//   // const posts = await res.json();

//   const res = await fetch(
//     `http://localhost:3001/api/calendar/${context.params.id}`
//   );
//   const result = await res.json();

//   // let res;
//   // const fetchData = async () => {
//   //   let result = await axios({
//   //     method: "get",
//   //     url: `/api/calendar/${context.params.id}`,
//   //     timeout: 15000, // 15 seconds timeout
//   //     headers: {},
//   //   });
//   //   res = result.data;
//   // };
//   // fetchData();

//   return {
//     props: {
//       result,
//     },
//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every second
//     revalidate: 1, // In seconds
//   };
// }

export default calendar;
