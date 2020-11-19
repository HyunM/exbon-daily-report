import { useState, useMemo, useEffect } from "react";
import styles from "./Schedule.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import axios from "axios";
const Schedule = () => {
  const [data, setData] = useState(() => [
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
    // {
    //   title: "1",
    //   start: "2020-11-10",
    //   end: "2020-11-11",
    // },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/dispatch-employee-assignment`,
        timeout: 15000, // 15 seconds timeout
        headers: {},
      });
      setData(result.data);
      console.log(data);
    };
    trackPromise(fetchData());
  }, []);

  const { promiseInProgress } = usePromiseTracker();
  return (
    <div className={styles["frame"]}>
      {promiseInProgress ? (
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
            eventColor="#3f83c2"
            events={data}
            dayMaxEventRows={3}
            eventTextColor="white"
            displayEventTime={false}
          />
          {/* <ReactTooltip multiline={true} type="info" offset={{ right: 150 }} /> */}
        </>
      )}
    </div>
  );
};

export default Schedule;
