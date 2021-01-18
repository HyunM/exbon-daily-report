import { useState, useEffect } from "react";
import styles from "./TabsOfBoth.module.css";
import { Button } from "@material-ui/core";
import axios from "axios";
import Router, { useRouter } from "next/router";

import SimpleTabs from "../components/MainTab/demo";

import { CookiesProvider, useCookies } from "react-cookie";
import Login from "../components/MainTab/login.js";

import "react-toastify/dist/ReactToastify.css";

const index = () => {
  const router = useRouter();

  //   const [prevTab, setPrevTab] = useState("timesheet");

  //   const [prevProject, setPrevProject] = useState();

  //   const [assignedProject, setAssignedProject] = useState([]);

  const [state, setState] = useState({
    prevTab: "timesheet",
    prevProject: 0,
    assignedProject: [],
  });

  const [cookies, setCookie, removeCookie] = useCookies("username");
  const [status, setStatus] = useState({
    cookies: {
      username: 0,
      password: 0,
      fullname: "",
      employeeid: 0,
    },
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

      setStatus({
        cookies: {
          username: cookies.username,
          password: cookies.password,
          fullname: cookies.fullname,
          employeeid: cookies.employeeid,
        },
      });
    });
  }, [router.query]);

  const clickGo = () => {
    const projectState = document.getElementById("select-project").value;

    Router.push(`/${state.prevTab}/${projectState}`);
  };

  const signin = async (username, password) => {
    await axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        Username: username,
        Password: password,
      },
    }).then((response) => {
      if (response.data.result.recordset[0] !== undefined) {
        setCookie("username", username, { path: "/", maxAge: 3600 * 24 * 30 });
        setCookie("password", password, { path: "/", maxAge: 3600 * 24 * 30 });
        setCookie("fullname", response.data.result.recordset[0].FullName, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setCookie("employeeid", response.data.result.recordset[0].EmployeeID, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setStatus((prevState) => ({
          ...prevState,
          cookies: {
            username: username,
            password: password,
            fullname: response.data.result.recordset[0].FullName,
            employeeid: response.data.result.recordset[0].EmployeeID,
          },
        }));
      } else {
        alert("Login failed.");
      }
    });
  };

  const logout = () => {
    removeCookie("username", { path: "/" });
    removeCookie("password", { path: "/" });
    removeCookie("fullname", { path: "/" });
    removeCookie("employeeid", { path: "/" });
    setStatus({
      cookies: {
        username: undefined,
        password: 0,
        fullname: "",
        employeeid: 0,
      },
    });
  };

  return (
    <>
      {console.log(state.assignedProject)}
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <Login signin={signin} />
      ) : (
        <>
          <SimpleTabs
            tapNo={0}
            projectState={0}
            main={true}
            employeeID={status.cookies.employeeid}
            employeeName={status.cookies.fullname}
            logout={logout}
          />
          <div className={styles["wrapper-select-project"]}>
            <h3 className={styles["projectID-text"]}>Project ID</h3>
            {state.assignedProject.length > 0 && (
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
      )}
    </>
  );
};

export default index;
