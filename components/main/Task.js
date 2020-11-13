import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useTable, useBlockLayout } from "react-table";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import { formatDate } from "./formatDate";

import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { deepOrange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Task.module.css";
import { useSelector, useDispatch } from "react-redux";
import ReportIcon from "@material-ui/icons/Report";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
toast.configure();
const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: deepOrange,
  },
  typography: {
    fontSize: 12,
    textAlign: "center",
  },
});
const Task = () => {
  const deleteQueue = useSelector(state => state.deleteQueue);
  const dispatch = useDispatch();

  const addUpdateQueue = value =>
    dispatch({
      type: "ADDUPDATEQUEUE",
      addUpdateQueue: value,
    });

  const initializeUpdateQueue = () =>
    dispatch({
      type: "INITIALIZEUPDATEQUEUE",
    });

  const initializeDeleteQueue = () =>
    dispatch({
      type: "INITIALIZEDELETEQUEUE",
    });

  const columns = useMemo(
    () => [
      // {
      //   Header: "Trade",
      //   accessor: "Trade",
      //   align: "center",
      // },
      {
        Header: "Company",
        accessor: "Company",
        width: 150,
      },
      {
        Header: "Task Name",
        accessor: "TaskName",
        width: 150,
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        width: 100,
      },
      {
        Header: "Finish Date",
        accessor: "FinishDate",
        width: 120,
      },
      {
        Header: "Previous Work %",
        accessor: "PreviousWork",
        width: 75,
      },
      {
        Header: "Current Work %",
        accessor: "CurrentWork",
        width: 75,
      },
      {
        Header: "Message",
        accessor: "Trade",
        align: "center",
        width: 330,
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = e => {
      setValue(e.target.value);
    };

    const onChangeDatePicker = e => {
      setValue(e);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    const onBlurForCurrentWork = e => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    // if (id === "RecordID") {
    //   return (
    //     <>
    //       <ReportIcon
    //         color="secondary"
    //         className={styles["table__report-icon"]}
    //         data-tip="Praesent non nunc mollis, fermentum neque at"
    //       />
    //       <ReactTooltip />
    //     </>
    //   );
    if (id === "Trade") {
      return <div className={styles["table__trade-wrapper"]}>{value}</div>;
    } else if (id === "Company") {
      return <div className={styles["table__company-wrapper"]}>{value}</div>;
    } else if (id === "TaskName") {
      return <div className={styles["table__task-name-wrapper"]}>{value}</div>;
    } else if (id === "StartDate") {
      return <div className={styles["table__start-date-wrapper"]}>{value}</div>;
    } else if (id === "FinishDate") {
      return (
        <div className={styles["table__finish-date-wrapper"]}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={defaultMaterialTheme}>
              <DatePicker
                // value={value.length === undefined ? value : value.split("-")}
                value={value}
                onChange={onChangeDatePicker}
                onBlur={onBlur}
                format="MM/dd/yyyy"
                className={styles["table__finish-date-wrapper__date-picker"]}
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>
        </div>
      );
    } else if (id === "PreviousWork") {
      return (
        <div className={styles["table__previous-work-wrapper"]}>{value} %</div>
      );
    } else if (id === "CurrentWork") {
      return (
        <div className={styles["table__current-work-wrapper"]}>
          <input
            className={styles["table__current-work-wrapper__input"]}
            value={value || ""}
            type="text"
            onChange={onChange}
            onBlur={onBlurForCurrentWork}
          />
          &nbsp; %
        </div>
      );
    }
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData(old =>
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
    },
    useBlockLayout
  );

  const now = new Date().toLocaleString({
    timeZone: "America/Los_Angeles",
  });

  const [selectedDate, setSelectedDate] = useState(now);

  const dateCheckEditable = str => {
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

    const toStr = str.toLocaleString();

    const newStr =
      toStr.split("/")[0] +
      "/" +
      toStr.split("/")[1] +
      "/" +
      toStr.split("/")[2];

    const dateFromStr = new Date(newStr);
    const sundayOfSelected = getSunday(dateFromStr);
    const sundayOfToday = getSunday(now);

    if (date_diff_indays(sundayOfToday, sundayOfSelected) >= 0) return true;
    else return false;
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleSaveBtn = () => {
    let promises = [];
    const fetchData = async () => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].CurrentWork === null || data[i].CurrentWork === "") {
          promises.push(
            axios({
              method: "put",
              url: `/api/project-tasks/${data[i].TaskID}`,
              timeout: 5000,
              headers: {},
              data: {
                FinishDate: data[i].FinishDate,
              },
            })
          );
        } else {
          promises.push(
            axios({
              method: "put",
              url: `/api/project-tasks/${data[i].TaskID}`,
              timeout: 5000,
              headers: {},
              data: {
                FinishDate: data[i].FinishDate,
              },
            })
          );
          promises.push(
            axios({
              method: "put",
              url: `/api/project-tasks-progress`,
              timeout: 5000,
              headers: {},
              data: {
                TaskID: data[i].TaskID,
                Date: document.getElementById("datePickerDialog").value,
                WorkCompleted: data[i].CurrentWork,
              },
            })
          );
        }
      }
    };

    trackPromise(fetchData());
    trackPromise(
      Promise.all(promises).then(() => {
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

    axios({
      method: "post",
      url: `/api/log-daily-reports`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        EmployeeID: 1,
        ProjectID: 6130,
        Date: formatDate(selectedDate),
        Category: "Tasks",
        Action: "update",
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/project-tasks-progress?selectedDate=${formatDate(
          selectedDate
        )}`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
      });

      setData(result.data);
    };

    trackPromise(fetchData());
    initializeDeleteQueue();
    initializeUpdateQueue();
  }, [selectedDate]);

  const { promiseInProgress } = usePromiseTracker();

  return (
    <div id={styles.mainDiv}>
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
          {console.log(data)}
          <div className={styles["header"]}>
            <div className={styles["header__left"]}>
              <h1 className={styles["header__left__title"]}>Tasks</h1>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  id="datePickerDialog"
                  label="Date"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={styles["header__left__date-picker"]}
                />
              </MuiPickersUtilsProvider>
              <h3 className={styles["header__left__project-id"]}>
                Project ID : 6130
              </h3>
            </div>
            {dateCheckEditable(selectedDate) && (
              <div className={styles["header__right"]}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={styles["header__right__save-btn"]}
                  startIcon={<SaveIcon />}
                  onClick={handleSaveBtn}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className={styles["table"]}>
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <td {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </td>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
