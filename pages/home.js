import { useState, useEffect } from "react";
import styles from "./TabsOfBoth.module.css";
import { Button } from "@material-ui/core";
import axios from "axios";
import Router, { useRouter } from "next/router";

import SimpleTabs from "../components/MainTab/demo";

const home = () => {
  const router = useRouter();

  //   const [prevTab, setPrevTab] = useState("timesheet");

  //   const [prevProject, setPrevProject] = useState();

  //   const [assignedProject, setAssignedProject] = useState([]);

  const [state, setState] = useState({
    prevTab: "timesheet",
    prevProject: 0,
    assignedProject: [],
  });

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
      //   setAssignedProject(() => response.data.result.recordsets[1]);
      let tab = "timesheet";
      let project = 0;
      if (router.query.tab !== undefined) tab = router.query.tab;
      if (router.query.project !== undefined) project = router.query.project;

      setState({
        prevTab: tab,
        prevProject: project,
        assignedProject: response.data.result.recordsets[1],
      });
    });
  }, [router.query]);

  const clickGo = () => {
    const projectState = document.getElementById("select-project").value;

    Router.push(`/${state.prevTab}/${projectState}`);
  };
  return (
    <>
      {console.log(state.assignedProject)}
      <SimpleTabs tapNo={0} projectState={0} main={true} />
      <div className={styles["wrapper-select-project"]}>
        <h3 className={styles["projectID-text"]}>Project ID</h3>
        {state.assignedProject.length > 1 && (
          <select
            id="select-project"
            className={styles["wrapper-select-project__select-project"]}
            defaultValue={state.prevProject}
          >
            {state.assignedProject.map((item) => {
              return (
                <option
                  key={item.ProjectID}
                  value={item.ProjectID}
                  // selected={state.prevProject === item.ProjectID ? true : false}
                >
                  {item.ProjectID}
                </option>
              );
            })}
          </select>
        )}
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
