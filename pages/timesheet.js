import { useState, useMemo, useEffect } from "react";
import axios from "axios";

import {
  useTable,
  useBlockLayout,
  useGroupBy,
  useExpanded,
  useSortBy,
} from "react-table";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import inputTime from "../components/main/inputTime";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import InputMask from "react-input-mask";
import { formatDate } from "../components/main/formatDate";
import styles from "./Timesheet.module.css";
import classNames from "classnames/bind";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Head from "next/head";

import MainTab from "../components/MainTab/MainTab";

import { CookiesProvider, useCookies } from "react-cookie";
import Login from "../components/MainTab/login.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Router, { useRouter } from "next/router";
import NotPermission from "../components/MainTab/NotPermission";

import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Autocomplete from "react-autocomplete";

import AddCircleIcon from "@material-ui/icons/AddCircle";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import moment from "moment";
import Modal from "react-modal";

toast.configure();
let afterSundayCheck = true;
let dataEmployees = [];
let dataTasks = [];
let dataLatest = [];
let id = -1000000;

const convertInputToTime = time => {
  let match = inputTime.filter(data => data.input === time);
  if (match[0] === undefined) {
    return "error";
  }
  return match[0].time;
};

const Timesheet = () => {
  const router = useRouter();
  const [projectState, setProjectState] = useState(undefined);
  const [checkDisableAddEmployeeButton, setCheckDisableAddEmployeeButton] =
    useState(false);
  const [stateAssignedProject, setStateAssignedProject] = useState([
    { ProjectID: 0 },
  ]);
  const [stateNoAssigned, setStateNoAssigned] = useState([]);
  const [checkState, setCheckState] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [status, setStatus] = useState({
    cookies: {
      username: 0,
      password: 0,
      fullname: "",
      employeeid: 0,
    },
    permission: true,
  });

  const getSunday = d => {
    d = new Date(d);
    let day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const date_diff_indays = (date1, date2) => {
    return Math.floor(
      (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) -
        Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  };

  const dateCheckEditable = str => {
    const toStr = str.toLocaleString();
    const newStr =
      toStr.split("/")[0] +
      "/" +
      toStr.split("/")[1] +
      "/" +
      toStr.split("/")[2].slice(0, 4);
    const dateFromStr = new Date(newStr);
    const sundayOfSelected = getSunday(dateFromStr);
    const sundayOfToday = getSunday(now);
    if (date_diff_indays(sundayOfToday, sundayOfSelected) >= 0) {
      afterSundayCheck = true;
      return true;
    } else {
      //Turning on the lockout
      afterSundayCheck = false;
      return false;

      //Turning off the lockout
      // afterSundayCheck = true;
      // return true;
    }
  };

  const [data, setData] = useState(() => []);
  const [dataTable, setDataTable] = useState(() => [
    {
      Id: id++,
      EmployeeID: 0,
      EmployeeName: "",
      TaskID: 0,
      StartTime: "07:00AM",
      EndTime: "04:00PM",
    },
  ]);
  const [dataView, setDataView] = useState(() => []);
  const [selectedEmployee, setSelectedEmployee] = useState(() => 0);
  const [selectedSummaryEmployee, setSelectedSummaryEmployee] = useState(
    () => 0
  );

  const convertTaskNameToID = name => {
    let task = dataTasks.find(task => name === task.Name);
    if (task) {
      return task.TaskID;
    } else {
      return 0;
    }
  };

  const convertEmployeeNameToID = name => {
    let employee = dataEmployees.find(
      employee => name === employee.EmployeeName
    );
    if (employee) {
      return employee.EmployeeID;
    } else {
      return 0;
    }
  };

  const now = new Date().toLocaleString({
    timeZone: "America/Los_Angeles",
  });

  const [selectedDate, setSelectedDate] = useState(now);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    let promises = [];
    if (!router.isReady) return;

    const fetchData = async () => {
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
          })
            .then(response => {
              const assignedProject = response.data.result.recordsets[1];
              setStateAssignedProject(response.data.result.recordsets[1]);
              if (
                response.data.result.recordsets[1].length > 0 &&
                projectState === undefined
              ) {
                if (router.query.pid) {
                  setProjectState(router.query.pid);
                } else {
                  setProjectState(
                    "" + response.data.result.recordsets[1][0].ProjectID
                  );
                }
              }

              if (status.permission === true && projectState !== undefined) {
                let check = 0;
                for (let i = 0; i < assignedProject.length; i++) {
                  if (
                    assignedProject[i].ProjectID.toString() === projectState
                  ) {
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
            })
            .catch(err => {
              alert(
                "Loading Error.(POST /api/daily-report/signin) \n\nPlease try again.\n\nPlease contact IT if the issue still persists. (Hyunmyung Kim 201-554-6666)\n\n" +
                  err
              );
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

      if (
        status.permission === true &&
        projectState !== undefined &&
        selectedDate !== undefined
      ) {
        router.push(`?pid=${projectState}`);
        await axios({
          method: "get",
          url: `/api/timesheets?selectedDate=${formatDate(
            selectedDate
          )}&projectID=${projectState}`,
          timeout: 5000, // 5 seconds timeout
          headers: {},
        }).then(result => {
          setData(result.data.result[0]);
          setDataTable([
            {
              Id: id++,
              EmployeeID: 0,
              EmployeeName: "",
              TaskID: 0,
              StartTime: "07:00AM",
              EndTime: "04:00PM",
            },
          ]);
          dataEmployees = result.data.result[1];
          dataTasks = result.data.result[2];
          dataLatest = result.data.result[3];
        });
      }
    };
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  }, [projectState, status, selectedDate, router.isReady]);

  const handleSaveTimesheetBtn = async () => {
    let promises = [];
    let checkSave = 0;

    const fetchData = async () => {
      let checkEmployeeName = data.find(element => element.EmployeeID === 0);
      let checkTaskName = data.find(element => element.TaskID === 0);
      let checkTime = 0;
      for (
        let i = 0;
        i < document.getElementsByClassName("table__labor-hours-input").length;
        i++
      ) {
        if (
          document.getElementsByClassName("table__labor-hours-input")[i]
            .innerText === "NaN"
        )
          checkTime++;
      }
      if (checkEmployeeName) {
        checkSave += 1;
        toast.error(
          <div className={styles["alert__table__employee-input"]}>
            Unable to save. <br /> Please check <strong>Employee Name </strong>.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        return null;
      } else if (checkTime) {
        checkSave += 1;
        toast.error(
          <div className={styles["alert__table__time-wrapper"]}>
            Unable to save. <br /> Please check the <strong>time input </strong>
            .
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        return null;
      } else if (checkTaskName) {
        checkSave += 1;
        toast.error(
          <div className={styles["alert__table__employee-input"]}>
            Unable to save. <br /> Please check <strong>Task Name </strong>.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        return null;
      }

      await axios({
        method: "delete",
        url: `/api/timesheets`,
        timeout: 3000, // 3 seconds timeout
        headers: {},
        data: {
          ProjectID: projectState,
          Date: formatDate(selectedDate),
        },
      });

      data.forEach(async element => {
        await axios({
          method: "post",
          url: `/api/timesheets`,
          timeout: 3000, // 3 seconds timeout
          headers: {},
          data: {
            ProjectID: projectState,
            Date: formatDate(selectedDate),
            EmployeeID: element.EmployeeID,
            TaskID: element.TaskID,
            Start: element.StartTime,
            End: element.EndTime,
          },
          //   @projectID int,
          //   @date date,
          //   @employeeID int,
          //   @taskID int,
          //   @start time(0),
          //   @end time(0)
        }).catch(err => {
          toast.error(
            <div className={styles["alert__complete"]}>
              <strong>CANNOT SAVE</strong>
              <p>Please check the time input.</p>
            </div>,
            {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
            }
          );
        });
      });
    };
    trackPromise(fetchData());
    trackPromise(
      Promise.all(promises).then(() => {
        if (checkSave === 0) {
          toast.success(
            <div className={styles["alert__complete"]}>
              <strong>Save Complete</strong>
            </div>,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              hideProgressBar: true,
            }
          );
        }
      })
    );
    axios({
      method: "post",
      url: `/api/log-daily-reports`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        EmployeeID: status.cookies.employeeid,
        ProjectID: projectState,
        Date: formatDate(selectedDate),
        Category: "Timesheet",
        Action: "update",
      },
    });
  };

  const { promiseInProgress } = usePromiseTracker();

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

  useEffect(() => {
    if (typeof stateAssignedProject[0] == "undefined") {
      setTimeout(() => {
        setStateNoAssigned(true);
      }, 3000);
    } else {
      setStateNoAssigned(false);
    }
  }, [stateAssignedProject]);

  const clickGetTheLatestData = () => {
    if (dataLatest.length !== 0) {
      setData(dataLatest);
    } else {
      toast.warning(
        <div className={styles["alert__table__hour-input"]}>
          No data found.
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        }
      );
    }
  };

  const toMilli = dataTime => {
    return new Date(convertInputToTime(dataTime).replace(" ", "T"));
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let tempData = [];
    data.forEach(element => {
      tempData.push({
        EmployeeID: element.EmployeeID,
        Name: element.EmployeeName,
        StartTime: element.TaskID == -2 ? 0 : toMilli(element.StartTime),
        EndTime: element.TaskID == -2 ? 0 : toMilli(element.EndTime),
        IsMeal: element.IsMeal,
        MealStart: element.TaskID == -2 ? toMilli(element.StartTime) : 0,
        MealFinish: element.TaskID == -2 ? toMilli(element.EndTime) : 0,
      });
    });

    let realData = [];
    for (let i = 0; i < tempData.length; i++) {
      if (i === 0) {
        realData.push({
          EmployeeID: tempData[i].EmployeeID,
          Name: tempData[i].Name,
          StartTime: tempData[i].StartTime,
          EndTime: tempData[i].EndTime,
          MealStart: tempData[i].MealStart,
          MealFinish: tempData[i].MealFinish,
        });
      }
      let check = 0;
      for (let j = 0; j < realData.length; j++) {
        if (tempData[i].Name === realData[j].Name) {
          realData[j].StartTime =
            realData[j].StartTime > tempData[i].StartTime &&
            tempData[i].StartTime !== 0
              ? tempData[i].StartTime
              : realData[j].StartTime;
          realData[j].EndTime =
            (realData[j].EndTime > tempData[i].EndTime ||
              tempData[i].EndTime === 0) &&
            realData[j].EndTime !== 0
              ? realData[j].EndTime
              : tempData[i].EndTime;
          realData[j].MealStart =
            realData[j].MealStart > tempData[i].MealStart &&
            tempData[i].MealStart !== 0
              ? tempData[i].MealStart
              : realData[j].MealStart;
          realData[j].MealFinish =
            (realData[j].MealFinish > tempData[i].MealFinish ||
              tempData[i].MealFinish === 0) &&
            realData[j].MealFinish !== 0
              ? realData[j].MealFinish
              : tempData[i].MealFinish;
          check += 1;
        }
      }
      if (check === 0) {
        realData.push({
          EmployeeID: tempData[i].EmployeeID,
          Name: tempData[i].Name,
          StartTime: tempData[i].StartTime,
          EndTime: tempData[i].EndTime,
          MealStart: tempData[i].MealStart,
          MealFinish: tempData[i].MealFinish,
        });
      }
    }
    setDataView(realData);
  }, [data]);

  const clickAddTaskBtn = () => {
    setDataTable(old => [
      ...old,
      {
        Id: id++,
        EmployeeID: old[0] !== undefined ? old[0].EmployeeID : 0,
        EmployeeName: "",
        TaskID: 0,
        StartTime: "07:00AM",
        EndTime: "04:00PM",
      },
    ]);
  };

  const clickDeleteTaskBtn = Id => {
    setDataTable(old =>
      old.filter(element => {
        return element.Id !== Id;
      })
    );
  };

  const changeTaskID = (Id, value) => {
    setDataTable(
      [...dataTable].map(object => {
        if (object.Id === Id) {
          return {
            ...object,
            TaskID: value,
          };
        } else return object;
      })
    );
  };

  const changeTime = (Id, when, format, timeValue) => {
    if (when === "start") {
      if (format === "hh") {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                StartTime: timeValue + object.StartTime.slice(2, 7),
              };
            } else return object;
          })
        );
      } else if (format === "mm") {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                StartTime:
                  object.StartTime.slice(0, 3) +
                  timeValue +
                  object.StartTime.slice(5, 7),
              };
            } else return object;
          })
        );
      } else {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                StartTime: object.StartTime.slice(0, 5) + timeValue,
              };
            } else return object;
          })
        );
      }
    } else {
      if (format === "hh") {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                EndTime: timeValue + object.EndTime.slice(2, 7),
              };
            } else return object;
          })
        );
      } else if (format === "mm") {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                EndTime:
                  object.EndTime.slice(0, 3) +
                  timeValue +
                  object.EndTime.slice(5, 7),
              };
            } else return object;
          })
        );
      } else {
        setDataTable(
          [...dataTable].map(object => {
            if (object.Id === Id) {
              return {
                ...object,
                EndTime: object.EndTime.slice(0, 5) + timeValue,
              };
            } else return object;
          })
        );
      }
    }
  };

  useEffect(() => {
    let tempData = [];
    if (selectedSummaryEmployee !== 0) {
      data.forEach(element => {
        if (element.EmployeeID === selectedSummaryEmployee) {
          tempData.push(element);
        }
      });
    } else {
      tempData = [
        {
          Id: id++,
          EmployeeID: 0,
          EmployeeName: "",
          TaskID: 0,
          StartTime: "07:00AM",
          EndTime: "04:00PM",
        },
      ];
    }

    setDataTable(tempData);
  }, [selectedSummaryEmployee]);

  const convertEmployeeIDtoEmployeeName = id => {
    let employeeName = "";
    dataEmployees.forEach(element => {
      if (element.EmployeeID == id) {
        employeeName = element.EmployeeName;
      }
    });
    return employeeName;
  };

  const handleClickAddEmployee = () => {
    let tempData = dataTable;

    tempData.forEach(element => {
      element.EmployeeID = selectedEmployee;
      element.EmployeeName = convertEmployeeIDtoEmployeeName(selectedEmployee);
    });

    setData(old => [...old, ...tempData]);
    setSelectedSummaryEmployee(selectedEmployee);
  };

  return (
    <>
      {console.log("data")}
      {console.log(data)}
      {console.log("dataView")}
      {console.log(dataView)}
      {console.log("dataTable")}
      {console.log(dataTable)}

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
      ) : !status.permission || stateNoAssigned === true ? (
        <NotPermission path="timesheet" />
      ) : (
        <>
          <MainTab
            tapNo={2}
            main={false}
            employeeID={status.cookies.employeeid}
            employeeName={status.cookies.fullname}
            logout={logout}
            projectState={router.query.pid}
          />
          <div id={styles.mainDiv}>
            {promiseInProgress || !projectState ? (
              <div
                style={{
                  marginTop: "30px",
                  width: "100%",
                  height: "100",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loader type="Oval" color="#fab906" height="150" width="150" />
              </div>
            ) : (
              <>
                <h1 className={styles["title"]}>Timesheet</h1>

                <div className={styles["header"]}>
                  <div className={styles["header__left"]}>
                    <select
                      id="project-state-id"
                      value={projectState}
                      onChange={e => setProjectState(e.target.value)}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "medium",
                        display: "inline-block",
                        color: "#74646e",
                        border: "1px solid #c8bfc4",
                        borderRadius: "4px",
                        boxShadow: "inset 1px 1px 2px #ddd8dc",
                        background: "#fff",
                        zIndex: "0",
                        position: "relative",
                        maxWidth: "390px",
                        height: "30px",
                      }}
                    >
                      {stateAssignedProject.map(item => {
                        return (
                          <option
                            value={item.ProjectID}
                            key={item.ProjectID}
                            projectgroup={item.ProjectGroup}
                            projectname={item.ProjectName}
                            contractno={item.ContractNumber}
                          >
                            {item.JobNumber} &emsp;[{item.ProjectGroup}]&ensp;
                            {item.ProjectName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className={styles["header__right"]}>
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? styles["header__right__save-btn"]
                            : styles["header__right__save-btn-before-sunday"]
                        }
                        onClick={handleSaveTimesheetBtn}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                      {selectedSummaryEmployee ? (
                        <Button
                          id="add-employee-button-id"
                          variant="contained"
                          color="secondary"
                          size="small"
                          className={
                            dateCheckEditable(selectedDate)
                              ? styles["header__right__update-btn"]
                              : styles[
                                  "header__right__update-btn-before-sunday"
                                ]
                          }
                          startIcon={<AddIcon />}
                          disabled={checkDisableAddEmployeeButton}
                        >
                          Update&nbsp;Employee
                        </Button>
                      ) : (
                        <Button
                          id="add-employee-button-id"
                          variant="contained"
                          color="secondary"
                          size="small"
                          className={
                            dateCheckEditable(selectedDate)
                              ? styles["header__right__add-btn"]
                              : styles["header__right__add-btn-before-sunday"]
                          }
                          startIcon={<AddIcon />}
                          disabled={checkDisableAddEmployeeButton}
                          onClick={handleClickAddEmployee}
                        >
                          Add&nbsp;Employee
                        </Button>
                      )}

                      <Button
                        onClick={clickGetTheLatestData}
                        variant="contained"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? styles["header__right__save-btn"]
                            : styles["header__right__save-btn-before-sunday"]
                        }
                        disabled={afterSundayCheck ? false : true}
                        style={{
                          background: "#25a37d",
                          color: "#ffffff",
                          marginRight: "10px",
                        }}
                      >
                        Import Last Timesheet
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? styles["header__right__save-btn"]
                            : styles["header__right__save-btn-before-sunday"]
                        }
                        disabled={afterSundayCheck ? false : true}
                        style={{
                          background: "#43b6d3",
                          color: "#ffffff",
                          marginRight: "10px",
                        }}
                      >
                        Set Same Task
                      </Button>
                    </>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        margin="normal"
                        id="datePickerDialog"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={styles["header__right__date-picker"]}
                        autoOk={true}
                        okLabel=""
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
                <div>
                  <div className={styles["employee-dropdown-wrapper"]}>
                    {!selectedSummaryEmployee ? (
                      <select
                        className={styles["employee-dropdown"]}
                        value={selectedEmployee}
                        onChange={e => setSelectedEmployee(e.target.value)}
                      >
                        <option value="0">
                          --------Choose Employee--------
                        </option>
                        {dataEmployees.map(element => {
                          for (let i = 0; i < data.length; i++) {
                            if (element.EmployeeID == data[i].EmployeeID)
                              return <></>;
                          }
                          return (
                            <option
                              key={element.EmployeeID}
                              value={element.EmployeeID}
                            >
                              {element.EmployeeName}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <select
                        className={styles["employee-dropdown"]}
                        value={selectedSummaryEmployee}
                        onChange={e => setSelectedEmployee(e.target.value)}
                        disabled={true}
                      >
                        <option value="0">
                          --------Choose Employee--------
                        </option>
                        {dataEmployees.map(element => {
                          return (
                            <option
                              key={element.EmployeeID}
                              value={element.EmployeeID}
                            >
                              {element.EmployeeName}
                            </option>
                          );
                        })}
                      </select>
                    )}

                    <Button onClick={clickAddTaskBtn}>Add Task</Button>
                  </div>
                  <div className={styles["table"]}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell width={300}>Task</TableCell>
                            <TableCell widht={100}>Start Time</TableCell>
                            <TableCell widht={100}>End Time</TableCell>
                            <TableCell widht={70}>Hours</TableCell>
                            <TableCell widht={10}></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataTable.map(element => {
                            return (
                              <TableRow key={element.Id}>
                                <TableCell>
                                  <div>
                                    <select
                                      className={styles["task-dropdown"]}
                                      value={element.TaskID}
                                      onChange={e =>
                                        changeTaskID(element.Id, e.target.value)
                                      }
                                    >
                                      <option value="0">
                                        -----------------------Choose
                                        Task----------------------
                                      </option>

                                      {dataTasks.map(elementTask => {
                                        return (
                                          <option
                                            key={elementTask.TaskID}
                                            value={elementTask.TaskID}
                                          >
                                            {elementTask.Name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className={styles["table__time-wrapper"]}
                                  >
                                    <InputMask
                                      className={
                                        afterSundayCheck
                                          ? classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__hour-input"
                                              ]
                                            )
                                          : classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__hour-input-before-sunday"
                                              ]
                                            )
                                      }
                                      mask="29"
                                      placeholder="01~12"
                                      formatChars={{
                                        2: "[0-1]",
                                        9: "[0-9]",
                                      }}
                                      disabled={afterSundayCheck ? false : true}
                                      defaultValue="07"
                                      value={element.StartTime.slice(0, 2)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "start",
                                          "hh",
                                          e.target.value
                                        )
                                      }
                                    />
                                    :
                                    <InputMask
                                      className={
                                        afterSundayCheck
                                          ? classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__min-input"
                                              ]
                                            )
                                          : classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__min-input-before-sunday"
                                              ]
                                            )
                                      }
                                      placeholder="00~50"
                                      mask="50"
                                      formatChars={{
                                        5: "[0-5]",
                                      }}
                                      disabled={afterSundayCheck ? false : true}
                                      defaultValue="00"
                                      value={element.StartTime.slice(3, 5)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "start",
                                          "mm",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <select
                                      className={classNames(
                                        "table__time-wrapper__target-disabled",
                                        styles["table__ampm-dropdown"]
                                      )}
                                      disabled={afterSundayCheck ? false : true}
                                      value={element.StartTime.slice(5, 7)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "start",
                                          "AP",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="AM">AM</option>
                                      <option value="PM">PM</option>
                                    </select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className={styles["table__time-wrapper"]}
                                  >
                                    <InputMask
                                      className={
                                        afterSundayCheck
                                          ? classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__hour-input"
                                              ]
                                            )
                                          : classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__hour-input-before-sunday"
                                              ]
                                            )
                                      }
                                      mask="29"
                                      placeholder="01~12"
                                      formatChars={{
                                        2: "[0-1]",
                                        9: "[0-9]",
                                      }}
                                      disabled={afterSundayCheck ? false : true}
                                      defaultValue="04"
                                      value={element.EndTime.slice(0, 2)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "end",
                                          "hh",
                                          e.target.value
                                        )
                                      }
                                    />
                                    :
                                    <InputMask
                                      className={
                                        afterSundayCheck
                                          ? classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__min-input"
                                              ]
                                            )
                                          : classNames(
                                              "table__time-wrapper__target-disabled",
                                              styles[
                                                "table__time-wrapper__min-input-before-sunday"
                                              ]
                                            )
                                      }
                                      placeholder="00~50"
                                      mask="50"
                                      formatChars={{
                                        5: "[0-5]",
                                      }}
                                      disabled={afterSundayCheck ? false : true}
                                      defaultValue="00"
                                      value={element.EndTime.slice(3, 5)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "end",
                                          "mm",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <select
                                      className={classNames(
                                        "table__time-wrapper__target-disabled",
                                        styles["table__ampm-dropdown"]
                                      )}
                                      disabled={afterSundayCheck ? false : true}
                                      value={element.EndTime.slice(5, 7)}
                                      onChange={e =>
                                        changeTime(
                                          element.Id,
                                          "end",
                                          "AP",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="AM">AM</option>
                                      <option value="PM">PM</option>
                                    </select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <span>
                                      {(
                                        (new Date(
                                          convertInputToTime(
                                            element.EndTime
                                          ).replace(" ", "T")
                                        ) -
                                          new Date(
                                            convertInputToTime(
                                              element.StartTime
                                            ).replace(" ", "T")
                                          )) /
                                        3600000
                                      ).toFixed(2) > 0
                                        ? (
                                            (new Date(
                                              convertInputToTime(
                                                element.EndTime
                                              ).replace(" ", "T")
                                            ) -
                                              new Date(
                                                convertInputToTime(
                                                  element.StartTime
                                                ).replace(" ", "T")
                                              )) /
                                            3600000
                                          ).toFixed(2)
                                        : (
                                            parseFloat(
                                              (
                                                (new Date(
                                                  convertInputToTime(
                                                    element.EndTime
                                                  ).replace(" ", "T")
                                                ) -
                                                  new Date(
                                                    convertInputToTime(
                                                      element.StartTime
                                                    ).replace(" ", "T")
                                                  )) /
                                                3600000
                                              ).toFixed(2)
                                            ) + 24
                                          ).toFixed(2)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className={styles["table__delete-input"]}
                                  >
                                    <DeleteForeverIcon
                                      color="action"
                                      className={styles["table__delete-icon"]}
                                      onClick={() =>
                                        clickDeleteTaskBtn(element.Id)
                                      }
                                    ></DeleteForeverIcon>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>

                {dataView.length === 0 ? (
                  <></>
                ) : (
                  <div className={styles["second-table"]}>
                    <h3
                      style={{
                        textAlign: "center",
                        fontFamily: "sans-serif",
                        color: "#9d9ce7",
                      }}
                    >
                      Timesheet Summary
                    </h3>
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Start</th>
                          <th>Finish</th>
                          <th>Meal Start</th>
                          <th>Meal Finish</th>
                          <th>Labor Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map(cell => {
                          return (
                            <tr
                              key={cell.Name}
                              style={
                                cell.EmployeeID === selectedSummaryEmployee
                                  ? {
                                      backgroundColor: "#95b5e0",
                                    }
                                  : {}
                              }
                              onClick={() => {
                                if (
                                  cell.EmployeeID === selectedSummaryEmployee
                                ) {
                                  setSelectedSummaryEmployee(0);
                                  setSelectedEmployee(0);
                                } else {
                                  setSelectedSummaryEmployee(cell.EmployeeID);
                                  setSelectedEmployee(cell.EmployeeID);
                                }
                              }}
                            >
                              <td
                                style={
                                  cell.EmployeeID === selectedSummaryEmployee
                                    ? {
                                        color: "#ffffff",
                                        fontWeight: "500",
                                      }
                                    : {}
                                }
                              >
                                {cell.Name}
                              </td>
                              <td style={{ textAlign: "right", width: "80px" }}>
                                {moment(cell.StartTime).format("LT") ===
                                moment(cell.EndTime).format("LT")
                                  ? ""
                                  : moment(cell.StartTime).format("LT")}
                              </td>
                              <td style={{ textAlign: "right", width: "80px" }}>
                                {moment(cell.StartTime).format("LT") ===
                                moment(cell.EndTime).format("LT")
                                  ? ""
                                  : moment(cell.EndTime).format("LT")}
                              </td>
                              <td style={{ textAlign: "right", width: "80px" }}>
                                {moment(cell.MealStart).format("LT") ===
                                moment(cell.MealFinish).format("LT")
                                  ? ""
                                  : moment(cell.MealStart).format("LT")}
                              </td>
                              <td style={{ textAlign: "right", width: "80px" }}>
                                {moment(cell.MealStart).format("LT") ===
                                moment(cell.MealFinish).format("LT")
                                  ? ""
                                  : moment(cell.MealFinish).format("LT")}
                              </td>
                              <td style={{ textAlign: "right", width: "90px" }}>
                                {(
                                  (cell.EndTime -
                                    cell.StartTime -
                                    (cell.MealFinish - cell.MealStart)) /
                                  3600000
                                ).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Timesheet;
