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
import styles from "./SubcontractorTask.module.css";
import { useSelector, useDispatch } from "react-redux";
toast.configure();
const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: deepOrange,
  },
});
const SubcontractorTask = () => {
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
      {
        Header: "Trade",
        accessor: "Trade",
        align: "center",
      },
      {
        Header: "Company",
        accessor: "Company",
        align: "center",
      },
      {
        Header: "Task Name",
        accessor: "TaskName",
        align: "center",
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        align: "center",
      },
      {
        Header: "Finish Date",
        accessor: "FinishDate",
        align: "center",
      },
      {
        Header: "Previous Work Completion",
        accessor: "PreviousWork",
        align: "center",
      },
      {
        Header: "Current Work Completion",
        accessor: "CurrentWork",
        align: "center",
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
      if (
        parseFloat(
          e.target.parentNode.parentNode.previousElementSibling.innerText
        ) >= parseFloat(e.target.value)
      ) {
        toast.warning(
          <div className={styles["alert__table__current-work-wrapper__input"]}>
            Current Work must be <strong>bigger</strong> than Previous Work.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        updateMyData(index, id, value);
      } else {
        updateMyData(index, id, value);
      }
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
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
                value={value.length === undefined ? value : value.split("-")}
                onChange={onChangeDatePicker}
                onBlur={onBlur}
                format="yyyy-MM-dd"
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
            type="number"
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
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateMyData,
  });

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
    let checkSavePossibleForCurrentWork = 0;
    data.forEach(element => {
      if (
        !(
          element.CurrentWork > element.PreviousWork ||
          element.CurrentWork === "" ||
          element.CurrentWork === 0
        )
      )
        checkSavePossibleForCurrentWork++;
    });
    if (checkSavePossibleForCurrentWork) {
      toast.error(
        <div className={styles["alert__table__current-work-wrapper__input"]}>
          Unable to save. <br /> Please check <strong>Current Work </strong>
          input.
          <br />
          (Current Work must be bigger than Previous Work)
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
    } else {
      const fetchData = async () => {
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].LastDate.slice(0, 10) ===
            document.getElementById("datePickerDialog").value
          ) {
            if (data[i].CurrentWork === "" || data[i].CurrentWork === 0) {
              await axios({
                method: "put",
                url: `/api/project-sub-tasks/${data[i].TaskID}`,
                timeout: 5000,
                headers: {},
                data: {
                  FinishDate: data[i].FinishDate,
                },
              });
            } else {
              await axios({
                method: "put",
                url: `/api/project-sub-tasks-progress/${data[i].RecordID}`,
                timeout: 5000,
                headers: {},
                data: {
                  WorkCompleted: data[i].CurrentWork,
                },
              });
              await axios({
                method: "put",
                url: `/api/project-sub-tasks/${data[i].TaskID}`,
                timeout: 5000,
                headers: {},
                data: {
                  FinishDate: data[i].FinishDate,
                },
              });
            }
          } else {
            if (data[i].CurrentWork === "" || data[i].CurrentWork === 0) {
              await axios({
                method: "put",
                url: `/api/project-sub-tasks/${data[i].TaskID}`,
                timeout: 5000,
                headers: {},
                data: {
                  FinishDate: data[i].FinishDate,
                },
              });
            } else {
              await axios({
                method: "put",
                url: `/api/project-sub-tasks/${data[i].TaskID}`,
                timeout: 5000,
                headers: {},
                data: {
                  FinishDate: data[i].FinishDate,
                },
              });
              await axios({
                method: "post",
                url: `/api/project-sub-tasks-progress`,
                timeout: 5000,
                headers: {},
                data: {
                  TaskID: data[i].TaskID,
                  Date: document.getElementById("datePickerDialog").value,
                  WorkCompleted: data[i].CurrentWork,
                },
              });
            }
          }
        }
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/project-sub-tasks-progress?selectedDate=${formatDate(
          selectedDate
        )}`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
      });

      setData(result.data);
    };

    fetchData();
    initializeDeleteQueue();
    initializeUpdateQueue();
  }, [selectedDate]);

  return (
    <div id={styles.mainDiv}>
      {/* {console.log("data")}
      {console.log(data)} */}
      <div className={styles["header"]}>
        <div className={styles["header__left"]}>
          <h2 className={styles["header__left__title"]}>Subcontractor Tasks</h2>
          <MuiPickersUtilsProvider utils={DateFnsUtils} width="10">
            <KeyboardDatePicker
              margin="normal"
              id="datePickerDialog"
              label="Date"
              format="yyyy-MM-dd"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              value={selectedDate}
              onChange={handleDateChange}
              className={styles["header__left__date-picker"]}
            />
          </MuiPickersUtilsProvider>
          <h3 className={styles["header__left__project-id"]}>Project ID : 7</h3>
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
        <TableContainer component={Paper}>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TableCell
                      {...column.getHeaderProps()}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {column.render("Header")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
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
    </div>
  );
};

export default SubcontractorTask;
