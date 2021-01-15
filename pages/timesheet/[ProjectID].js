import { useState, useMemo, useEffect } from "react";
import axios from "axios";

import { useTable } from "react-table";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import inputTime from "../../components/main/inputTime";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import InputMask from "react-input-mask";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { formatDate } from "../../components/main/formatDate";
import Autocomplete from "react-autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Timesheet.module.css";
import classNames from "classnames/bind";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Router, { useRouter } from "next/router";
import Head from "next/head";

import SimpleTabs from "../../components/MainTab/demo";

import { CookiesProvider, useCookies } from "react-cookie";
import Login from "../../components/MainTab/login.js";

toast.configure();
let afterSundayCheck = true;

let dataEmployees;

const convertInputToTime = (time) => {
  let match = inputTime.filter((data) => data.input === time);
  if (match[0] === undefined) {
    return "error";
  }
  return match[0].time;
};

const Timesheet = () => {
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
  });

  const getSunday = (d) => {
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

  const dateCheckEditable = (str) => {
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
      afterSundayCheck = false;
      return false;
    }
  };

  const deleteQueue = useSelector((state) => state.deleteQueue);
  const updateQueue = useSelector((state) => state.updateQueue);

  const dispatch = useDispatch();

  const addUpdateQueue = (value) =>
    dispatch({
      type: "ADDUPDATEQUEUE",
      addUpdateQueue: value,
    });

  const addDeleteQueue = (value) =>
    dispatch({
      type: "ADDDELETEQUEUE",
      addDeleteQueue: value,
    });

  const initializeUpdateQueue = () =>
    dispatch({
      type: "INITIALIZEUPDATEQUEUE",
    });

  const initializeDeleteQueue = () =>
    dispatch({
      type: "INITIALIZEDELETEQUEUE",
    });

  const [checkState, setCheckState] = useState(true);
  const checkChange = (event) => {
    if (event.target.checked) {
      for (
        let i = 12;
        i <
        document.getElementsByClassName("table__time-wrapper__target-disabled")
          .length;
        i++
      ) {
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].classList.add("table__time-wrapper__target-disabled--disabled");
      }
      setSameTime();
    } else {
      for (
        let i = 12;
        i <
        document.getElementsByClassName("table__time-wrapper__target-disabled")
          .length;
        i++
      ) {
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].removeAttribute("disabled");
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].classList.remove(
            "table__time-wrapper__target-disabled--disabled"
          );
      }
    }
    setCheckState(event.target.checked);
  };

  const columns = useMemo(
    () => [
      {
        Header: " ", //Delete Timesheet
        accessor: "TimesheetID",
        width: 30,
      },
      {
        Header: "Employee Name",
        accessor: "EmployeeName",
        width: 120,
      },
      {
        Header: "Position",
        accessor: "Position",
        width: 130,
      },
      {
        Header: "Work Start",
        accessor: "WorkStart",
        width: 120,
      },
      {
        Header: "Meal Start",
        accessor: "MealStart",
        width: 120,
      },
      {
        Header: "Meal End",
        accessor: "MealEnd",
        width: 120,
      },
      {
        Header: "Work End",
        accessor: "WorkEnd",
        width: 120,
      },
      {
        Header: "Labor Hours",
        accessor: "laborHours",
        width: 40,
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);
  // const [dataEmployees, setDataEmployees] = useState(() => []);

  // Create an editable cell renderer
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    row,
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onCheckHour = (e) => {
      const TimesheetID = e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
        "value"
      );
      addUpdateQueue(TimesheetID);
      if (12 < parseInt(e.target.value)) {
        toast.warning(
          <div className={styles["alert__table__hour-input"]}>
            Only <strong>00 to 12</strong> can be entered into the time hour
            input.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        setValue("  :" + value.slice(3, 5) + value.slice(5, 7));
      } else {
        setValue(e.target.value + ":" + value.slice(3, 5) + value.slice(5, 7));
      }
    };

    const onCheckMin = (e) => {
      const TimesheetID = e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
        "value"
      );
      addUpdateQueue(TimesheetID);
      setValue(value.slice(0, 2) + ":" + e.target.value + value.slice(5, 7));
    };

    const onCheckAmPm = (e) => {
      const TimesheetID = e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
        "value"
      );
      addUpdateQueue(TimesheetID);
      if (e.target.value === "AM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "AM");
      } else if (e.target.value === "PM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "PM");
      } else {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + e.target.value);
      }
    };

    const onChangePosition = (e) => {
      const TimesheetID = e.target.parentElement.parentElement.children[0].children[0].getAttribute(
        "value"
      );
      addUpdateQueue(TimesheetID);
      setValue(e.target.value);
    };

    const onChange = (e) => {
      const TimesheetID = e.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute(
        "value"
      );
      addUpdateQueue(TimesheetID);
      setValue(e.target.value);
    };

    const onChangeSelect = (value) => {
      setValue(value);
      updateEmployeeData(index, id, value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = (e) => {
      if (document.getElementById("checkboxForSetSameTime")) {
        if (document.getElementById("checkboxForSetSameTime").checked) {
          updateMyData(index, id, value);
          setSameTime();
        } else {
          updateMyData(index, id, value);
        }
      } else {
        updateMyData(index, id, value); //important bug fix but why?
      }
    };

    const onBlurForEmployee = (e) => {
      updateEmployeeData(index, id, value);
    };

    const clickDeleteTimesheet = (value) => {
      //value = TimesheetID
      deleteTimesheetRow(index, id);
      addDeleteQueue(value);
      // deleteQueue.push(value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "TimesheetID") {
      if (afterSundayCheck === true) {
        return (
          <DeleteForeverIcon
            color="action"
            className={styles["table__delete-icon"]}
            value={value}
            onClick={() => clickDeleteTimesheet(value)}
          ></DeleteForeverIcon>
        );
      } else return <></>;
    } else if (id === "Position") {
      return (
        <select
          value={value}
          onChange={onChangePosition}
          onBlur={onBlur}
          className={styles["table__position-dropdown"]}
          disabled={afterSundayCheck ? false : true}
        >
          <option value={"Director"}>Director</option>
          <option value={"PIC"}>PIC</option>
          <option value={"Associate"}>Associate</option>
        </select>
      );
    } else if (
      id === "WorkStart" ||
      id === "MealStart" ||
      id === "MealEnd" ||
      id === "WorkEnd"
    ) {
      return (
        <div className={styles["table__time-wrapper"]}>
          <InputMask
            value={value.slice(0, 2)}
            onChange={onCheckHour}
            onBlur={onBlur}
            className={
              afterSundayCheck
                ? classNames(
                    "table__time-wrapper__target-disabled",
                    styles["table__time-wrapper__hour-input"]
                  )
                : classNames(
                    "table__time-wrapper__target-disabled",
                    styles["table__time-wrapper__hour-input-before-sunday"]
                  )
            }
            mask="29"
            placeholder="01~12"
            formatChars={{
              2: "[0-1]",
              9: "[0-9]",
            }}
            disabled={afterSundayCheck ? false : true}
          />
          :
          <InputMask
            value={value.slice(3, 5)}
            onChange={onCheckMin}
            onBlur={onBlur}
            className={
              afterSundayCheck
                ? classNames(
                    "table__time-wrapper__target-disabled",
                    styles["table__time-wrapper__min-input"]
                  )
                : classNames(
                    "table__time-wrapper__target-disabled",
                    styles["table__time-wrapper__min-input-before-sunday"]
                  )
            }
            placeholder="00~50"
            mask="50"
            formatChars={{
              5: "[0-5]",
            }}
            disabled={afterSundayCheck ? false : true}
          />
          <select
            value={value.slice(5, 7)}
            onChange={onCheckAmPm}
            onBlur={onBlur}
            className={classNames(
              "table__time-wrapper__target-disabled",
              styles["table__ampm-dropdown"]
            )}
            disabled={afterSundayCheck ? false : true}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      );
    } else if (id === "EmployeeName") {
      return (
        <Autocomplete
          getItemValue={(item) => item.EmployeeName}
          items={dataEmployees}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.EmployeeID}
              style={{ background: isHighlighted ? "lightgray" : "white" }}
            >
              {item.EmployeeName}
            </div>
          )}
          shouldItemRender={(item, value) =>
            item.EmployeeName.toLowerCase().indexOf(value.toLowerCase()) > -1
          }
          value={value}
          onChange={onChange}
          inputProps={{ onBlur: onBlurForEmployee }}
          onSelect={(val) => onChangeSelect(val)}
          renderInput={(props) => {
            return (
              <input
                className={
                  afterSundayCheck
                    ? styles["table__employee-input"]
                    : styles["table__employee-input-before-sunday"]
                }
                disabled={afterSundayCheck ? false : true}
                {...props}
              ></input>
            );
          }}
        />
      );
    } else if (id === "laborHours") {
      let laborDate = (
        (new Date(convertInputToTime(row.values.WorkEnd).replace(" ", "T")) -
          new Date(convertInputToTime(row.values.WorkStart).replace(" ", "T")) -
          (new Date(convertInputToTime(row.values.MealEnd).replace(" ", "T")) -
            new Date(
              convertInputToTime(row.values.MealStart).replace(" ", "T")
            ))) /
        3600000
      ).toFixed(2);
      if (parseFloat(laborDate) < 0) {
        laborDate = (parseFloat(laborDate) + 24).toFixed(2);
      }

      return (
        <div
          className={classNames([
            styles["table__labor-hours-input"],
            "table__labor-hours-input",
          ])}
        >
          {laborDate}
        </div>
      );
    }
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const updateEmployeeData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
            ["EmployeeID"]: convertEmployeeNameToID(value),
          };
        }
        return row;
      })
    );
  };

  const updateTimesheetIDData = (InsertID, TimesheetID) => {
    setData((old) =>
      old.map((row, index) => {
        if (row.InsertID === InsertID) {
          return {
            ...old[index],
            ["TimesheetID"]: TimesheetID,
          };
        }
        return row;
      })
    );
  };

  const convertEmployeeNameToID = (name) => {
    let employee = dataEmployees.find(
      (employee) => name === employee.EmployeeName
    );
    if (employee) {
      return employee.EmployeeID;
    } else {
      return 0;
    }
  };

  const setSameTime = () => {
    setData((old) =>
      old.map((row, index) => {
        return {
          ...old[index],
          WorkStart: old[0].WorkStart,
          MealStart: old[0].MealStart,
          MealEnd: old[0].MealEnd,
          WorkEnd: old[0].WorkEnd,
        };
      })
    );
  };

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  };

  const addTimesheetRow = () => {
    setData([
      ...data,
      {
        TimesheetID: 0,
        EmployeeID: 0,
        EmployeeName: "",
        Date: formatDate(selectedDate),
        Position: "Director",
        WorkStart: data[0] !== undefined ? data[0].WorkStart : "07:00AM",
        MealStart: data[0] !== undefined ? data[0].MealStart : "12:00PM",
        MealEnd: data[0] !== undefined ? data[0].MealEnd : "01:00PM",
        WorkEnd: data[0] !== undefined ? data[0].WorkEnd : "05:00PM",
        InsertID: getRandomIntInclusive(1, 10000000),
      },
    ]);
  };

  const deleteTimesheetRow = (rowIndex, columnId) => {
    setData((old) =>
      old.filter((row, index) => {
        return index !== rowIndex;
      })
    );
  };

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData,
    }
    // useBlockLayout
  );
  // Render the UI for your table

  const now = new Date().toLocaleString({
    timeZone: "America/Los_Angeles",
  });

  const [selectedDate, setSelectedDate] = useState(now);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/timesheets?selectedDate=${formatDate(
          selectedDate
        )}&projectID=${projectState}`,
        timeout: 1000, // 5 seconds timeout
        headers: {},
      });
      if (result.data.result[0].length === 0) {
        setCheckState(true);
      } else {
        setCheckState(false);
      }
      setData(result.data.result[0]);
      dataEmployees = result.data.result[1];

      setStatus({
        cookies: {
          username: cookies.username,
          password: cookies.password,
          fullname: cookies.fullname,
          employeeid: cookies.employeeid,
        },
      });
    };

    trackPromise(fetchData());
    initializeDeleteQueue();
    initializeUpdateQueue();

    // setPreviousProject(projectState);
  }, [selectedDate, projectState]);

  useEffect(() => {
    if (checkState) {
      for (
        let i = 12;
        i <
        document.getElementsByClassName("table__time-wrapper__target-disabled")
          .length;
        i++
      ) {
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].classList.add("table__time-wrapper__target-disabled--disabled");
      }
    } else {
      for (
        let i = 12;
        i <
        document.getElementsByClassName("table__time-wrapper__target-disabled")
          .length;
        i++
      ) {
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].removeAttribute("disabled");
        document
          .getElementsByClassName("table__time-wrapper__target-disabled")
          [i].classList.remove(
            "table__time-wrapper__target-disabled--disabled"
          );
      }
    }
  }, [data]);

  const handleSaveTimesheetBtn = () => {
    let checkEmployeeName = data.find((employee) => employee.EmployeeID === 0);
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
      toast.error(
        <div className={styles["alert__table__employee-input"]}>
          Unable to save. <br /> Please check <strong>employee name </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
      return null;
    } else if (checkTime) {
      toast.error(
        <div className={styles["alert__table__time-wrapper"]}>
          Unable to save. <br /> Please check the <strong>time input </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
      return null;
    } else {
      let promises = [];

      const fetchData = async () => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].TimesheetID === 0) {
            promises.push(
              await axios({
                method: "post",
                url: `/api/timesheets`,
                timeout: 5000, // 5 seconds timeout
                headers: {},
                data: {
                  ProjectID: projectState,
                  EmployeeID: data[i].EmployeeID,
                  Position: data[i].Position,
                  Date: data[i].Date,
                  WorkStart: data[i].WorkStart,
                  WorkEnd: data[i].WorkEnd,
                  MealStart: data[i].MealStart,
                  MealEnd: data[i].MealEnd,
                },
              }).then((response) => {
                updateTimesheetIDData(
                  data[i].InsertID,
                  response.data.TimesheetID
                );
              })
            );
          } else {
            promises.push(
              axios({
                method: "put",
                url: `/api/timesheets/${data[i].TimesheetID}`,
                timeout: 5000, // 5 seconds timeout
                headers: {},
                data: {
                  EmployeeID: data[i].EmployeeID,
                  Position: data[i].Position,
                  WorkStart: data[i].WorkStart,
                  WorkEnd: data[i].WorkEnd,
                  MealStart: data[i].MealStart,
                  MealEnd: data[i].MealEnd,
                },
              })
            );
          }
        }
        for (let i = 0; i < deleteQueue.length; i++) {
          promises.push(
            axios({
              method: "delete",
              url: `/api/timesheets/${deleteQueue[i]}`,
              timeout: 5000, // 5 seconds timeout
              headers: {},
            })
          );
        }
        initializeDeleteQueue();
        initializeUpdateQueue();
      };

      trackPromise(fetchData());
      trackPromise(
        Promise.all(promises).then((result) => {
          toast.success(
            <div className={styles["alert__complete"]}>
              <strong>Save Complete</strong>
            </div>,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              hideProgressBar: true,
            }
          );
        })
      );
    }

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

  const goMain = () => {
    Router.push({
      pathname: "/",
      query: { tab: "timesheet", project: projectState },
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
      <Head>
        <title>Daily Report</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {status.cookies.username === undefined ? (
        <Login signin={signin} />
      ) : (
        <>
          <SimpleTabs
            tapNo={0}
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
                <Loader type="Audio" color="#4e88de" height="100" width="100" />
              </div>
            ) : (
              <>
                <div className={styles["header"]}>
                  <div className={styles["header__left"]}>
                    <h2 className={styles["header__left__title"]}>Timesheet</h2>

                    <h3 className={styles["header__left__project-id"]}>
                      Project ID :{" "}
                      <span
                        onClick={() => {
                          goMain();
                          // setProjectState(0);
                        }}
                        className={styles["header__left__project-id__value"]}
                      >
                        {projectState}
                      </span>
                    </h3>
                  </div>
                  <div className={styles["header__right"]}>
                    {/* {dateCheckEditable(selectedDate) && ( */}
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
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? styles["header__right__add-btn"]
                            : styles["header__right__add-btn-before-sunday"]
                        }
                        onClick={addTimesheetRow}
                        startIcon={<AddIcon />}
                      >
                        Add&nbsp;Row
                      </Button>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkState}
                            onChange={checkChange}
                            name="checkbox"
                            color="secondary"
                            id="checkboxForSetSameTime"
                          />
                        }
                        label="Set Same Time of All"
                        className={
                          dateCheckEditable(selectedDate)
                            ? styles["header__right__checkbox"]
                            : styles["header__right__checkbox-before-sunday"]
                        }
                      />
                    </>
                    {/* )} */}
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
                    <p className={styles["header__right__label-date-picker"]}>
                      Date
                    </p>
                  </div>
                </div>
                <div className={styles["table"]}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        {headerGroups.map((headerGroup) => (
                          <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <TableCell {...column.getHeaderProps()}>
                                {column.render("Header")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableHead>
                      <TableBody>
                        {rows.map((row, i) => {
                          prepareRow(row);
                          return (
                            <TableRow {...row.getRowProps()}>
                              {row.cells.map((cell) => {
                                return (
                                  <TableCell {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Timesheet;
