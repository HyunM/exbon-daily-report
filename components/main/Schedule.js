import styles from "./Schedule.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Schedule = () => {
  return (
    <div className={styles["frame"]}>
      <FullCalendar plugins={[dayGridPlugin]} />
    </div>
  );
};

export default Schedule;
