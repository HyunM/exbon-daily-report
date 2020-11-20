import { useState, useMemo, useEffect } from "react";
import styles from "./Schedule.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import axios from "axios";
import { formatDate } from "./formatDate";
const Schedule = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/dispatch-employee-assignment`,
        timeout: 15000, // 15 seconds timeout
        headers: {},
      });
      setData(result.data);
    };
    trackPromise(fetchData());
  }, []);

  const { promiseInProgress } = usePromiseTracker();
  return (
    <div className={styles["frame"]}>
      {console.log(data)}
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
            eventColor="#1dd369"
            events={data}
            dayMaxEventRows={3}
            eventTextColor="white"
            displayEventTime={false}
            eventDidMount={handleEventPositioned}
          />
          <ReactTooltip multiline={true} type="info" offset={{ right: 50 }} />
        </>
      )}
    </div>
  );
};

export default Schedule;
