import React, { Fragment, useState, useMemo, useEffect } from "react";
import axios from "axios";

import { useTable } from "react-table";
import { withStyles, makeStyles } from "@material-ui/core/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { toDate } from "date-fns";
import inputTime from "./inputTime";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import InputMask from "react-input-mask";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import useSwr from "swr";
import Link from "next/link";
import { formatDate } from "./formatDate";
import { employeeInfo } from "./Employee";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "react-autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";

// let deleteQueue = []; //must be modified

toast.configure();

const convertInputToTime = time => {
  let match = inputTime.filter(data => data.input === time);
  if (match[0] === undefined) {
    return "error";
  }
  return match[0].time;
};

const Timesheet = () => {
  return (
    <>
      <div className="halfTable">
        <TimesheetTable />
        <div className="mt-5"></div>
      </div>
    </>
  );
};

const TimesheetTable = () => {
  const deleteQueue = useSelector(state => state.deleteQueue);
  const dispatch = useDispatch();
  const addDeleteQueue = value =>
    dispatch({
      type: "ADDDELETEQUEUE",
      addDeleteQueue: value,
    });

  const initializaDeleteQueue = () =>
    dispatch({
      type: "INITIALIZE",
    });

  const [checkState, setCheckState] = useState(false);
  const checkChange = event => {
    if (event.target.checked) {
      for (
        let i = 12;
        i < document.getElementsByClassName("disabledTime").length;
        i++
      ) {
        document
          .getElementsByClassName("disabledTime")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("disabledTime")
          [i].classList.add("classDisabled");
      }
      setSameTime();
    } else {
      for (
        let i = 12;
        i < document.getElementsByClassName("disabledTime").length;
        i++
      ) {
        document
          .getElementsByClassName("disabledTime")
          [i].removeAttribute("disabled");
        document
          .getElementsByClassName("disabledTime")
          [i].classList.remove("classDisabled");
      }
    }
    setCheckState(event.target.checked);
  };

  const columns = useMemo(
    () => [
      {
        Header: " ", //Delete Timesheet
        accessor: "TimesheetID",
      },
      {
        Header: "Employee Name",
        accessor: "EmployeeName",
      },
      {
        Header: "Trade",
        accessor: "Trade",
      },
      {
        Header: "Work Start",
        accessor: "WorkStart",
      },
      {
        Header: "Meal Start",
        accessor: "MealStart",
      },
      {
        Header: "Meal End",
        accessor: "MealEnd",
      },
      {
        Header: "Work End",
        accessor: "WorkEnd",
      },
      {
        Header: "Labor Hours",
        accessor: "laborHours",
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);

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

    const onCheckHour = e => {
      if (12 < parseInt(e.target.value)) {
        toast.warning(
          <div className="text-center">
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

    const onCheckMin = e => {
      setValue(value.slice(0, 2) + ":" + e.target.value + value.slice(5, 7));
    };

    const onCheckAmPm = e => {
      if (e.target.value === "AM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "AM");
      } else if (e.target.value === "PM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "PM");
      } else {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + e.target.value);
      }
    };

    const onChange = e => {
      setValue(e.target.value);
    };

    const onChangeSelect = value => {
      setValue(value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = e => {
      if (document.getElementById("checkbox1")) {
        if (document.getElementById("checkbox1").checked) {
          updateMyData(index, id, value);
          setSameTime();
        } else {
          updateMyData(index, id, value);
        }
      } else {
        updateMyData(index, id, value);
      }
    };

    const onBlurForEmployee = e => {
      let employee = employeeInfo.find(
        employee => value === employee.FirstName + " " + employee.LastName
      );
      if (employee) {
        updateEmployeeData(index, id, value);
      } else {
        toast.warning(
          <div className="text-center">
            <strong>That employee name</strong> does not exist.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        updateEmployeeData(index, id, value);
      }
    };

    const clickDeleteTimesheet = value => {
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
      let check = dateCheckEditable(
        new Date(document.getElementById("date-picker-dialog").value)
      );
      if (check)
        return (
          <DeleteForeverIcon
            color="action"
            className="deletePointer"
            onClick={() => clickDeleteTimesheet(value)}
          ></DeleteForeverIcon>
        );
      else return <></>;
    } else if (id === "Trade") {
      return (
        <select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="tableSelect"
        >
          <option value={"Project Manager"}>Project Manager</option>
          <option value={"Roofer"}>Roofer</option>
          <option value={"Sheet Metal"}>Sheet Metal</option>
        </select>
      );
    } else if (
      id === "WorkStart" ||
      id === "MealStart" ||
      id === "MealEnd" ||
      id === "WorkEnd"
    ) {
      return (
        <div className="flex">
          <InputMask
            value={value.slice(0, 2)}
            onChange={onCheckHour}
            onBlur={onBlur}
            className="timeInput disabledTime"
            mask="29"
            placeholder="01~12"
            formatChars={{
              2: "[0-1]",
              9: "[0-9]",
            }}
          />
          :
          <InputMask
            value={value.slice(3, 5)}
            onChange={onCheckMin}
            onBlur={onBlur}
            className="timeInput disabledTime"
            placeholder="00~50"
            mask="50"
            formatChars={{
              5: "[0-5]",
            }}
          />
          <select
            value={value.slice(5, 7)}
            onChange={onCheckAmPm}
            onBlur={onBlur}
            className="ampm disabledTime tableSelect"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      );
    } else if (id === "EmployeeName") {
      return (
        // <input
        //   className="tableInput employeeInput"
        //   value={value}
        //   onChange={onChange}
        //   onBlur={onBlurForEmployee}
        // />
        <Autocomplete
          getItemValue={item => item.FirstName + " " + item.LastName}
          items={employeeInfo}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.EmployeeID}
              style={{ background: isHighlighted ? "lightgray" : "white" }}
            >
              {item.FirstName + " " + item.LastName}
            </div>
          )}
          shouldItemRender={(item, value) =>
            (item.FirstName + " " + item.LastName)
              .toLowerCase()
              .indexOf(value.toLowerCase()) > -1
          }
          value={value}
          onChange={onChange}
          inputProps={{ onBlur: onBlurForEmployee }}
          onSelect={val => onChangeSelect(val)}
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
      // let laborDate = (
      //   (new Date(row.values.WorkEnd) -
      //     new Date(row.values.WorkStart) -
      //     (new Date(row.values.MealStart) - new Date(row.values.MealEnd))) /
      //   3600000
      // ).toFixed(2);

      return <div className="text-right laborDiv">{laborDate}</div>;
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

  const updateEmployeeData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData(old =>
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

  const convertEmployeeNameToID = name => {
    let employee = employeeInfo.find(
      employee => name === employee.FirstName + " " + employee.LastName
    );
    if (employee) {
      return employee.EmployeeID;
    } else {
      return 0;
    }
  };

  const setSameTime = () => {
    setData(old =>
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

  const addTimesheetRow = () => {
    setData([
      ...data,
      {
        TimesheetID: 0,
        EmployeeID: 0,
        EmployeeName: "",
        Date: formatDate(selectedDate),
        Trade: "Project Manager",
        // WorkStart: data[0] !== undefined ? data[0].WorkStart : "07:00AM",
        // MealStart: data[0] !== undefined ? data[0].MealStart : "12:00PM",
        // MealEnd: data[0] !== undefined ? data[0].MealEnd : "01:00PM",
        // WorkEnd: data[0] !== undefined ? data[0].WorkEnd : "05:00PM",
        WorkStart: "07:00AM",
        MealStart: "12:00PM",
        MealEnd: "01:00PM",
        WorkEnd: "05:00PM",
      },
    ]);
  };

  const deleteTimesheetRow = (rowIndex, columnId) => {
    setData(old =>
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
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateMyData,
  });
  // Render the UI for your table

  const now = new Date().toLocaleString({
    timeZone: "America/Los_Angeles",
  });

  const [selectedDate, setSelectedDate] = useState(now);

  const getSunday = d => {
    d = new Date(d);
    var day = d.getDay(),
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
    const dateFromStr = new Date(
      toStr.split("/")[0] +
        "-" +
        toStr.split("/")[1] +
        "-" +
        toStr.split("/")[2]
    );
    const sundayOfSelected = getSunday(dateFromStr);
    const sundayOfToday = getSunday(now);
    if (date_diff_indays(sundayOfToday, sundayOfSelected) >= 0) return true;
    else return false;
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/timesheets?selectedDate=${formatDate(selectedDate)}`,
        timeout: 4000, // 4 seconds timeout
        headers: {},
        // data: {
        //   firstName: "David",
        //   lastName: "Pollock",
        // },
      });

      setData(result.data);
    };

    fetchData();
    initializaDeleteQueue();
  }, [selectedDate]);

  useEffect(() => {
    if (checkState) {
      for (
        let i = 12;
        i < document.getElementsByClassName("disabledTime").length;
        i++
      ) {
        document
          .getElementsByClassName("disabledTime")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("disabledTime")
          [i].classList.add("classDisabled");
      }
    }
  }, [data.length]);

  const handleSaveTimesheetBtn = () => {
    let checkEmployeeName = data.find(employee => employee.EmployeeID === 0);
    let checkTime = 0;
    for (
      let i = 0;
      i < document.getElementsByClassName("laborDiv").length;
      i++
    ) {
      if (document.getElementsByClassName("laborDiv")[i].innerText === "NaN")
        checkTime++;
    }
    if (checkEmployeeName) {
      toast.error(
        <div className="text-center">
          Unable to save. <br /> Please check <strong>employee name </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
    } else if (checkTime++) {
      toast.error(
        <div className="text-center">
          Unable to save. <br /> Please check the <strong>time input </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
    } else {
      const fetchData = async () => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].TimesheetID === 0) {
            await axios({
              method: "post",
              url: `/api/timesheets`,
              timeout: 4000, // 4 seconds timeout
              headers: {},
              data: {
                EmployeeID: data[i].EmployeeID,
                Trade: data[i].Trade,
                Date: data[i].Date,
                WorkStart: data[i].WorkStart,
                WorkEnd: data[i].WorkEnd,
                MealStart: data[i].MealStart,
                MealEnd: data[i].MealEnd,
              },
            });
          } else {
            await axios({
              method: "put",
              url: `/api/timesheets/${data[i].TimesheetID}`,
              timeout: 4000, // 4 seconds timeout
              headers: {},
              data: {
                EmployeeID: data[i].EmployeeID,
                Trade: data[i].Trade,
                WorkStart: data[i].WorkStart,
                WorkEnd: data[i].WorkEnd,
                MealStart: data[i].MealStart,
                MealEnd: data[i].MealEnd,
              },
            });
          }
        }
        for (let i = 0; i < deleteQueue.length; i++) {
          await axios({
            method: "delete",
            url: `/api/timesheets/${deleteQueue[i]}`,
            timeout: 4000, // 4 seconds timeout
            headers: {},
          });
        }
        initializaDeleteQueue();
      };

      fetchData();
      toast.success(
        <div className="text-center">
          <strong>Save Complete</strong>
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
    }
  };

  return (
    <>
      <div className="responsiveFlex timesheetAndDate">
        {console.log("data")}
        {console.log(data)}
        {console.log("deleteQueue")}
        {console.log(deleteQueue)}
        {console.log("dateCheckThisWeek(selectedDate)")}
        {console.log(dateCheckEditable(selectedDate))}

        {/* {console.log("getSunday")}
        {console.log(getSunday(selectedDate))}
        {console.log("check Sunday")}
        {console.log(
          getSunday(selectedDate) === getSunday(now)
            ? "editable"
            : "not editable"
        )} */}

        <div className="flex">
          <h1 className="mr-5" id="timesheetTitle">
            Timesheet
          </h1>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Timesheet Date"
              format="yyyy-MM-dd"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <h3 id="projectID">Project ID : 7</h3>
        </div>
        {dateCheckEditable(selectedDate) && (
          <div className="flex">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkState}
                  onChange={checkChange}
                  name="checkbox"
                  color="secondary"
                  id="checkbox1"
                />
              }
              label="Set Same Time of All"
              className="checkBoxForm"
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className="addBtn"
              onClick={addTimesheetRow}
              startIcon={<AddIcon />}
            >
              Add&nbsp;Row
            </Button>
            <Button
              id="saveTimesheetBtn"
              variant="contained"
              color="primary"
              onClick={handleSaveTimesheetBtn}
              size="small"
              className="saveBtn"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="flex timeTableBtn"></div>
      <div className="tableDiv">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
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
    </>
  );
};

export default Timesheet;
