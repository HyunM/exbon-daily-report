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
import { deepOrange, blue } from "@material-ui/core/colors";
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
import EventBusyIcon from "@material-ui/icons/EventBusy";
import Modal from "react-modal";
Modal.setAppElement("#modalForTasksTab");

toast.configure();
const themeForWorkDate = createMuiTheme({
  palette: {
    primary: deepOrange,
  },

  typography: {
    fontSize: 12,
    textAlign: "center",
  },
});

const themeForNoWork = createMuiTheme({
  palette: {
    primary: {
      main: blue["300"],
    },
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
        width: 160,
      },
      {
        Header: "Task Name",
        accessor: "TaskName",
        width: 140,
      },
      {
        Header: "Work Date",
        accessor: "StartDate",
        width: 180,
      },
      // {
      //   Header: "Finish Date",
      //   accessor: "FinishDate",
      //   width: 90,
      // },
      {
        Header: "Previous Work %",
        accessor: "PreviousWork",
        width: 70,
      },
      {
        Header: "Current Work %",
        accessor: "CurrentWork",
        width: 70,
      },
      {
        Header: "Message",
        accessor: "Trade",
        align: "center",
        width: 377,
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    row,
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
      return (
        <div className={styles["table__trade-wrapper"]}>
          <span className={styles["table__trade-wrapper__data"]}>{value}</span>
        </div>
      );
    } else if (id === "Company") {
      return (
        <div className={styles["table__company-wrapper"]}>
          <span className={styles["table__company-wrapper__data"]}>
            {value}
          </span>
        </div>
      );
    } else if (id === "TaskName") {
      return (
        <div className={styles["table__task-name-wrapper"]}>
          <span className={styles["table__task-name-wrapper__data"]}>
            {value}
          </span>
        </div>
      );
    } else if (id === "StartDate") {
      return (
        <div className={styles["table__date-wrapper"]}>
          <span
            className={styles["table__date-wrapper__data"]}
            onClick={openModalWorkDate}
          >
            {value} ~ {row.original.FinishDate}
          </span>
        </div>
      );
    } else if (id === "PreviousWork") {
      return (
        <div className={styles["table__previous-work-wrapper"]}>
          <span className={styles["table__previous-work-wrapper__data"]}>
            {value} %
          </span>
        </div>
      );
    } else if (id === "CurrentWork") {
      return (
        <div className={styles["table__current-work-wrapper"]}>
          <span className={styles["table__current-work-wrapper__data"]}>
            {value === null ? (
              <input
                className={
                  styles["table__current-work-wrapper__input__previous-work"]
                }
                value={row.allCells[4].value}
                type="number"
                onChange={onChange}
                onBlur={onBlurForCurrentWork}
              ></input>
            ) : (
              <input
                className={
                  styles["table__current-work-wrapper__input__current-work"]
                }
                value={value}
                type="number"
                onChange={onChange}
                onBlur={onBlurForCurrentWork}
              ></input>
            )}
            %
          </span>
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
        if (
          data[i].CurrentWork === null ||
          data[i].CurrentWork === "" ||
          data[i].CurrentWork.toString() === data[i].PreviousWork.toString()
        ) {
          promises.push(
            axios({
              method: "put",
              url: `/api/project-tasks/${data[i].TaskID}`,
              timeout: 5000,
              headers: {},
              data: {
                StartDate: data[i].StartDate,
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
                StartDate: data[i].StartDate,
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

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [modalNoWorkIsOpen, setModalNoWorkIsOpen] = React.useState(false);

  const afterOpenModalNoWork = () => {
    // references are now sync'd and can be accessed.
  };

  const openModalNoWork = () => {
    setModalNoWorkIsOpen(true);
  };

  const closeModalNoWork = () => {
    setModalNoWorkIsOpen(false);
  };

  const [startDateOfNoWork, setStartDateOfNoWork] = useState(
    new Date("2014/02/08")
  );
  const [endDateOfNoWork, setEndDateOfNoWork] = useState(
    new Date("2014/02/10")
  );

  const handleStartDateOfNoWork = date => {
    setStartDateOfNoWork(date);
  };

  const handleEndDateOfNoWork = date => {
    setEndDateOfNoWork(date);
  };

  const [modalWorkDateIsOpen, setModalWorkDateIsOpen] = React.useState(false);

  const afterOpenModalWorkDate = () => {
    // references are now sync'd and can be accessed.
  };

  const openModalWorkDate = () => {
    setModalWorkDateIsOpen(true);
  };

  const closeModalWorkDate = () => {
    setModalWorkDateIsOpen(false);
  };

  const [startDateOfWorkDate, setStartDateOfWorkDate] = useState(
    new Date("2014/02/08")
  );
  const [endDateOfWorkDate, setEndDateOfWorkDate] = useState(
    new Date("2014/02/10")
  );

  const handleStartDateOfWorkDate = date => {
    setStartDateOfWorkDate(date);
  };

  const handleEndDateOfWorkDate = date => {
    setEndDateOfWorkDate(date);
  };

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
            {/* {dateCheckEditable(selectedDate) && ( */}
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
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<EventBusyIcon />}
                className={styles["header__right__set-no-work-days-btn"]}
                onClick={openModalNoWork}
              >
                Set No Work Days
              </Button>
              <Modal
                isOpen={modalNoWorkIsOpen}
                onAfterOpen={afterOpenModalNoWork}
                onRequestClose={closeModalNoWork}
                style={customStyles}
                contentLabel="Example Modal"
                className={styles["modal-set-no-work-days"]}
              >
                <div
                  className={styles["modal-set-no-work-days__wrapper-title"]}
                >
                  <h4
                    className={
                      styles["modal-set-no-work-days__wrapper-title__title"]
                    }
                  >
                    Set No Work Days
                  </h4>
                </div>
                <div
                  className={
                    styles["modal-set-no-work-days__wrapper-date-picker"]
                  }
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <ThemeProvider theme={themeForNoWork}>
                      <DatePicker
                        // value={value.length === undefined ? value : value.split("-")}
                        value={startDateOfNoWork}
                        onChange={handleStartDateOfNoWork}
                        format="MM/dd/yyyy"
                        label="Start Date"
                        className={
                          styles[
                            "modal-set-no-work-days__wrapper-date-picker__start-date"
                          ]
                        }
                      />
                      <DatePicker
                        // value={value.length === undefined ? value : value.split("-")}
                        value={endDateOfNoWork}
                        onChange={handleEndDateOfNoWork}
                        format="MM/dd/yyyy"
                        label="End Date"
                        className={
                          styles[
                            "modal-set-no-work-days__wrapper-date-picker__end-date"
                          ]
                        }
                      />
                    </ThemeProvider>
                  </MuiPickersUtilsProvider>
                </div>
                <div className={styles["modal-set-no-work-days__wrapper-btn"]}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={closeModalNoWork}
                    className={
                      styles["modal-set-no-work-days__wrapper-btn__btn-save"]
                    }
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={closeModalNoWork}
                    className={
                      styles["modal-set-no-work-days__wrapper-btn__btn-cancel"]
                    }
                  >
                    Cancel
                  </Button>
                </div>
                <p className={styles["test"]}>
                  (This is a test, so NOT working yet. )
                </p>
              </Modal>
            </div>
            {/* )} */}
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
                    <tr {...row.getRowProps()} className={styles["table__row"]}>
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

      <Modal
        isOpen={modalWorkDateIsOpen}
        onAfterOpen={afterOpenModalWorkDate}
        onRequestClose={closeModalWorkDate}
        style={customStyles}
        contentLabel="Example Modal"
        className={styles["modal-work-date"]}
      >
        <div className={styles["modal-work-date__wrapper-title"]}>
          <h4 className={styles["modal-work-date__wrapper-title__title"]}>
            Work Date
          </h4>
        </div>
        <div className={styles["modal-work-date__wrapper-date-picker"]}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={themeForWorkDate}>
              <DatePicker
                // value={value.length === undefined ? value : value.split("-")}
                value={startDateOfWorkDate}
                onChange={handleStartDateOfWorkDate}
                format="MM/dd/yyyy"
                label="Start Date"
                className={
                  styles["modal-work-date__wrapper-date-picker__start-date"]
                }
              />
              <DatePicker
                // value={value.length === undefined ? value : value.split("-")}
                value={endDateOfWorkDate}
                onChange={handleEndDateOfWorkDate}
                format="MM/dd/yyyy"
                label="End Date"
                className={
                  styles["modal-work-date__wrapper-date-picker__end-date"]
                }
              />
            </ThemeProvider>
          </MuiPickersUtilsProvider>
        </div>
        <div className={styles["modal-work-date__wrapper-btn"]}>
          <Button
            variant="contained"
            size="small"
            onClick={closeModalWorkDate}
            className={styles["modal-work-date__wrapper-btn__btn-save"]}
          >
            Save
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={closeModalWorkDate}
            className={styles["modal-work-date__wrapper-btn__btn-cancel"]}
          >
            Cancel
          </Button>
        </div>
        <p className={styles["test"]}>(This is a test, so NOT working yet. )</p>
      </Modal>
    </div>
  );
};

export default Task;
