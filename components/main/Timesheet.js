import React, { useState, useMemo } from "react";
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
import InputMask from "react-input-mask";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const convertTimeToInput = time => {
  let match = inputTime.filter(data => data.time === time);
  return match[0].input;
};

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
  const [checkState, setCheckState] = useState(false);
  const checkChange = event => {
    if (event.target.checked) {
      let a = document.getElementsByClassName("disabledTime");
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
        Header: "Employee Name",
        accessor: "employeeName",
      },
      {
        Header: "Trade",
        accessor: "trade",
      },
      {
        Header: "Work From",
        accessor: "workFrom",
      },
      {
        Header: "Meal From",
        accessor: "mealFrom",
      },
      {
        Header: "Meal To",
        accessor: "mealTo",
      },
      {
        Header: "Work To",
        accessor: "workTo",
      },
      {
        Header: "Labor Hours",
        accessor: "laborHours",
      },
    ],
    []
  );

  const [data, setData] = useState(() => [
    {
      employeeName: "Hyunmyung",
      trade: "Roofer",
      workFrom: "07:00AM",
      mealFrom: "12:00PM",
      mealTo: "01:00PM",
      workTo: "05:00PM",
    },
    {
      employeeName: "John Doe",
      trade: "Project Manager",
      workFrom: "06:00AM",
      mealFrom: "12:00PM",
      mealTo: "02:00PM",
      workTo: "08:00PM",
    },
    {
      employeeName: "Jane Doe",
      trade: "Sheet Metal",
      workFrom: "08:00AM",
      mealFrom: "12:00PM",
      mealTo: "12:00PM",
      workTo: "11:30AM",
    },
    {
      employeeName: "Baby Doe",
      trade: "Sheet Metal",
      workFrom: "07:10AM",
      mealFrom: "12:00PM",
      mealTo: "12:40PM",
      workTo: "03:30PM",
    },
    {
      employeeName: "Johnny Doe",
      trade: "Project Manager",
      workFrom: "11:00AM",
      mealFrom: "05:00PM",
      mealTo: "06:00PM",
      workTo: "10:00PM",
    },
    {
      employeeName: "Richard Roe",
      trade: "Roofer",
      workFrom: "07:30AM",
      mealFrom: "01:00PM",
      mealTo: "01:30PM",
      workTo: "05:30PM",
    },
  ]);

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
        alert("Please input 00 ~ 12 number");
        setValue("  :" + value.slice(3, 5) + value.slice(5, 7));
      } else {
        setValue(e.target.value + ":" + value.slice(3, 5) + value.slice(5, 7));
      }
    };

    const onCheckMin = e => {
      // if (12 < parseInt(e.target.value)) {
      //   alert("error");
      //   setValue("");
      // } else {
      // }
      setValue(value.slice(0, 2) + ":" + e.target.value + value.slice(5, 7));
    };

    const onCheckAmPm = e => {
      // if (12 < parseInt(e.target.value)) {
      //   alert("error");
      //   setValue("");
      // } else {
      // }
      if (e.target.value === "aM" || e.target.value === "AM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "AM");
      } else if (e.target.value === "pM" || e.target.value === "PM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "PM");
      } else {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + e.target.value);
      }
    };

    const onChange = e => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = e => {
      if (document.getElementById("checkbox1").checked) {
        updateMyData(index, id, value);
        setSameTime();
      } else {
        updateMyData(index, id, value);
      }
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "trade") {
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
      id === "workFrom" ||
      id === "mealFrom" ||
      id === "mealTo" ||
      id === "workTo"
    ) {
      return (
        <div className="flex">
          {/* <InputMask
              onChange={onChange}
              className="timeInput"
              mask="29:90 1M"
              formatChars={{
                2: "[0-1]",
                9: "[0-9]",
                1: "[AP]",
              }}
              min="01"
              max="12"
            /> */}
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

        /* <input
            type="time"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="tableInput"
            step="600"
          /> */

        // <select
        //   value={value}
        //   onChange={onChangeTime}
        //   onBlur={onBlur}
        //   className="scrollChange"
        // >
        //   {inputTime.map(inputTime => (
        //     <option key={inputTime.time} value={inputTime.time}>
        //       {inputTime.input}
        //     </option>
        //   ))}
        // </select>
      );
    } else if (id === "employeeName") {
      return (
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="tableInput"
        />
      );
    } else if (id === "laborHours") {
      let laborDate = (
        (new Date(convertInputToTime(row.values.workTo).replace(" ", "T")) -
          new Date(convertInputToTime(row.values.workFrom).replace(" ", "T")) -
          (new Date(convertInputToTime(row.values.mealTo).replace(" ", "T")) -
            new Date(
              convertInputToTime(row.values.mealFrom).replace(" ", "T")
            ))) /
        3600000
      ).toFixed(2);

      return <div className="text-right">{laborDate}</div>;
    }
    0;
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

  const setSameTime = () => {
    setData(old =>
      old.map((row, index) => {
        return {
          ...old[index],
          workFrom: old[0].workFrom,
          mealFrom: old[0].mealFrom,
          mealTo: old[0].mealTo,
          workTo: old[0].workTo,
        };
      })
    );
  };

  const addTimesheetRow = () => {
    setData([
      ...data,
      {
        employeeName: "",
        trade: "Project Manager",
        workFrom: "07:00AM",
        mealFrom: "12:00PM",
        mealTo: "01:00PM",
        workTo: "05:00PM",
      },
    ]);
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

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleString({
      timeZone: "America/Los_Angeles",
    })
  );

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="responsiveFlex timesheetAndDate">
        <div className="flex">
          <h1 className="mr-5" id="timesheetTitle">
            Timesheet
          </h1>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Timesheet Date"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
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
            Add
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="saveBtn"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="flex timeTableBtn"></div>
      <div className="tableDiv">
        <TableContainer component={Paper}>
          <Table>
            {console.log(data)}
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
