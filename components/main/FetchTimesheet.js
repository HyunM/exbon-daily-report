import Timesheet from "./Timesheet";
import useSwr from "swr";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { formatDate } from "./formatDate";

export const FetchTimesheet = () => {
  const fetcher = url => fetch(url).then(res => res.json());

  const convertDate = date => {
    date.slice(5, 9) + "-" + date.slice(0, 2) + "-" + date.slice(3, 5);
  };

  const [dateState, setDateState] = useState(
    formatDate(
      new Date().toLocaleString({
        timeZone: "America/Los_Angeles",
      })
    )
  );
  console.log(dateState);

  const { data, error } = useSwr(
    "/api/timesheets?selectedDate=" + dateState,
    fetcher
  );
  if (!data) return <div>Loading data...</div>;
  if (error) return <div>Failed to load users</div>;
  return (
    <>
      <Timesheet
        data={data}
        dateState={dateState}
        setDateState={setDateState}
      ></Timesheet>
    </>
  );
};
