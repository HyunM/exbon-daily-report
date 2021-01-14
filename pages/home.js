import { useState, useEffect } from "react";
import styles from "./TabsOfBoth.module.css";
import { Button } from "@material-ui/core";
import axios from "axios";
import Router, { useRouter } from "next/router";

import SimpleTabs from "../components/MainTab/demo";

const home = ({ previousProject = 0 }) => {
  const router = useRouter();
  let tabs;
  router.query.tab !== undefined
    ? (tabs = router.query.tab)
    : (tabs = "timesheet");

  const [assignedProject, setAssignedProject] = useState([]);
  useEffect(() => {
    axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        Username: "hyunmyung.kim",
        Password:
          "0x40E0A47936CA3E0A624072613A9792F845418FC5C16D4B7A01F79D7E3C690E1A",
      },
    }).then((response) => {
      setAssignedProject(response.data.result.recordsets[1]);
    });
  }, []);

  const clickGo = () => {
    const projectState = document.getElementById("select-project").value;

    Router.push(`/${tabs}/${projectState}`);
  };
  return (
    <>
      {console.log(tabs)}
      <SimpleTabs tapNo={3} projectState={0} main={true} />
      <div className={styles["wrapper-select-project"]}>
        <h3 className={styles["projectID-text"]}>Project ID</h3>
        <select
          id="select-project"
          className={styles["wrapper-select-project__select-project"]}
          defaultValue={
            previousProject
              ? previousProject
              : assignedProject[0] !== undefined
              ? assignedProject[0].ProjectID
              : 0
          }
        >
          {assignedProject.map((item) => {
            return (
              <option key={item.ProjectID} value={item.ProjectID}>
                {item.ProjectID}
              </option>
            );
          })}
        </select>
        <Button
          // onClick={handleProjectState}
          color="primary"
          className={styles["wrapper-select-project__btn-go"]}
          onClick={clickGo}
        >
          Go
        </Button>
      </div>
    </>
  );
};

export default home;
