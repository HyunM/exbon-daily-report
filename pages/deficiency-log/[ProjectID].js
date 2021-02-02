import { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./DeficiencyLog.module.css";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Router, { useRouter } from "next/router";
import Head from "next/head";

import SimpleTabs from "../../components/MainTab/demo";
import NotPermission from "../../components/MainTab/NotPermission";

import { CookiesProvider, useCookies } from "react-cookie";
import Login from "../../components/MainTab/login.js";
import "react-toastify/dist/ReactToastify.css";
import { TrendingUpTwoTone } from "@material-ui/icons";

toast.configure();

let projectInfoTab3;

const DeficiencyLog = (
  {
    // projectState,
    // setProjectState,
    // employeeInfo,
    // setPreviousProject,
  }
) => {
  const router = useRouter();
  const projectState = router.query.ProjectID;

  const [cookies, setCookie, removeCookie] = useCookies("username");
  const [status, setStatus] = useState({
    cookies: {
      username: 0,
      password: 0,
      fullname: "",
      employeeid: 0,
    },
    permission: true,
  });

  const [data, setData] = useState(() => []);

  useEffect(() => {
    if (status.cookies.username !== 0) {
      if (status.cookies.username !== undefined) {
        axios({
          method: "post",
          url: `/api/daily-report/signin`,
          timeout: 5000, // 2 seconds timeout
          headers: {},
          data: {
            Username: status.cookies.username,
            Password: status.cookies.password,
          },
        }).then(response => {
          const assignedProject = response.data.result.recordsets[1];

          if (status.permission === true && projectState !== undefined) {
            let check = 0;
            for (let i = 0; i < assignedProject.length; i++) {
              if (assignedProject[i].ProjectID.toString() === projectState) {
                check++;
                break;
              }
            }
            if (check === 0) {
              setStatus(prevState => ({
                ...prevState,
                permission: false,
              }));
            }
          }
        });
      }
    } else {
      setStatus(prevState => ({
        ...prevState,
        cookies: {
          username: cookies.username,
          password: cookies.password,
          fullname: cookies.fullname,
          employeeid: cookies.employeeid,
        },
      }));
    }

    if (status.permission === true && projectState !== undefined) {
      const fetchData = async () => {
        let result = await axios({
          method: "get",
          url: `/api/project-deficiency-log?projectID=${projectState}`,
          timeout: 5000, // 2 seconds timeout
          headers: {},
        });

        setData(result.data.result[0]);
        projectInfoTab3 = result.data.result[1];
      };

      trackPromise(fetchData());
    } else {
      setData([]);
    }
  }, [projectState, status]);

  const today = new Date()
    .toLocaleString({
      timeZone: "America/Los_Angeles",
    })
    .split(",")[0];

  const saveInspectionRecord = () => {
    const problem = document.getElementById("TextFieldForProblem").value;
    const actionTaken = document.getElementById("TextFieldForActionTaken")
      .value;

    const fetchData = async () => {
      axios({
        method: "post",
        url: `/api/project-deficiency-log/problem-and-action-taken`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        data: {
          ProjectID: projectState,
          Date: today,
          Problem: problem,
          ActionTaken: actionTaken,
        },
      });
    };
    fetchData();
    toast.success(
      <div className={styles["alert__complete"]}>
        <strong>Save Complete</strong>
      </div>,
      {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      }
    );

    axios({
      method: "post",
      url: `/api/log-daily-reports`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        EmployeeID: status.cookies.employeeid,
        ProjectID: projectState,
        Date: today,
        Category: "DeficiencyLog",
        Action: "update",
      },
    });
  };

  const { promiseInProgress } = usePromiseTracker();
  const goMain = () => {
    Router.push({
      pathname: "/",
      query: { tab: "deficiency-log", project: projectState },
    });
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
    }).then(response => {
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
        setStatus(prevState => ({
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
    setData([]);
    removeCookie("username", { path: "/" });
    removeCookie("password", { path: "/" });
    removeCookie("fullname", { path: "/" });
    removeCookie("employeeid", { path: "/" });
    setStatus(prevState => ({
      permission: true,
      cookies: {
        username: undefined,
        password: 0,
        fullname: "",
        employeeid: 0,
      },
    }));
  };
  return (
    <>
      <CookiesProvider>
        <Head>
          <title>Daily Report</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        {status.cookies.username === undefined ||
        status.cookies.employeeid === undefined ? (
          <Login signin={signin} />
        ) : !status.permission ? (
          <NotPermission />
        ) : (
          <>
            <SimpleTabs
              tapNo={2}
              projectState={projectState}
              main={false}
              employeeID={status.cookies.employeeid}
              employeeName={status.cookies.fullname}
              logout={logout}
            />
            <div id={styles.mainDiv}>
              {promiseInProgress || !projectState ? (
                <div
                  style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader
                    type="Audio"
                    color="#4e88de"
                    height="100"
                    width="100"
                  />
                </div>
              ) : (
                <>
                  <div className={styles["header"]}>
                    <h3 className={styles["header__project-id"]}>
                      <span
                        onClick={goMain}
                        className={styles["header__project-id__value"]}
                      >
                        {projectState}
                      </span>
                    </h3>
                    {projectInfoTab3 !== undefined &&
                    projectInfoTab3.length !== 0 ? (
                      <>
                        <h4 className={styles["header__project-group"]}>
                          [{projectInfoTab3[0].ProjectGroup}]
                        </h4>
                        <h4 className={styles["header__project-name"]}>
                          {projectInfoTab3[0].ProjectName}
                        </h4>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <Accordion defaultExpanded={true}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                    >
                      <Typography variant="h5" color="primary">
                        Deficiency Log
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles["inspection-record__wrapper"]}>
                        <div
                          className={
                            styles["inspection-record__wrapper__description"]
                          }
                        >
                          <TextField
                            id="TextFieldForProblem"
                            label="Problem"
                            multiline
                            rows={6}
                            defaultValue={
                              data[0] === undefined ? "" : data[0].Problem
                            }
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>
                        <div
                          className={
                            styles["inspection-record__wrapper__between"]
                          }
                        ></div>
                        <div
                          className={
                            styles["inspection-record__wrapper__resolution"]
                          }
                        >
                          <TextField
                            id="TextFieldForActionTaken"
                            label="Action Taken"
                            multiline
                            rows={6}
                            defaultValue={
                              data[0] === undefined ? "" : data[0].ActionTaken
                            }
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={saveInspectionRecord}
                      >
                        Save
                      </Button>
                    </AccordionActions>
                  </Accordion>
                  {/* <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
            >
              <Typography variant="h5" color="primary">
                Memo
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles["memo__wrapper"]}>
                <TextField
                  id="TextFieldForMemo"
                  multiline
                  rows={4}
                  defaultValue={data[0] === undefined ? "" : data[0].Memo}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button size="small" color="primary" onClick={saveMemo}>
                Save
              </Button>
            </AccordionActions>
          </Accordion> */}
                </>
              )}
            </div>
          </>
        )}
      </CookiesProvider>
    </>
  );
};

export default DeficiencyLog;
