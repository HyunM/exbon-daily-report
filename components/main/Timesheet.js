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
import InputMask from "react-input-mask";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import useSwr from "swr";
import Link from "next/link";
import { formatDate } from "./formatDate";
import { employeeInfo } from "./Employee";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "react-autocomplete";

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
        accessor: "EmployeeName",
      },
      {
        Header: "Trade",
        accessor: "Trade",
      },
      {
        Header: "Work From",
        accessor: "WorkStart",
      },
      {
        Header: "Meal From",
        accessor: "MealStart",
      },
      {
        Header: "Meal To",
        accessor: "MealEnd",
      },
      {
        Header: "Work To",
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

  // const [data, setData] = useState(() => [
  //   {
  //     EmployeeID: "Hyunmyung",
  //     Trade: "Roofer",
  //     WorkStart: "07:00AM",
  //     MealStart: "12:00PM",
  //     MealEnd: "01:00PM",
  //     WorkEnd: "05:00PM",
  //   },
  //   {
  //     EmployeeID: "John Doe",
  //     Trade: "Project Manager",
  //     WorkStart: "06:00AM",
  //     MealStart: "12:00PM",
  //     MealEnd: "02:00PM",
  //     WorkEnd: "08:00PM",
  //   },
  //   {
  //     EmployeeID: "Jane Doe",
  //     Trade: "Sheet Metal",
  //     WorkStart: "08:00AM",
  //     MealStart: "12:00PM",
  //     MealEnd: "12:00PM",
  //     WorkEnd: "11:30AM",
  //   },
  //   {
  //     EmployeeID: "Baby Doe",
  //     Trade: "Sheet Metal",
  //     WorkStart: "07:10AM",
  //     MealStart: "12:00PM",
  //     MealEnd: "12:40PM",
  //     WorkEnd: "03:30PM",
  //   },
  //   {
  //     EmployeeID: "Johnny Doe",
  //     Trade: "Project Manager",
  //     WorkStart: "11:00AM",
  //     MealStart: "05:00PM",
  //     MealEnd: "06:00PM",
  //     WorkEnd: "10:00PM",
  //   },
  //   {
  //     EmployeeID: "Richard Roe",
  //     Trade: "Roofer",
  //     WorkStart: "07:30AM",
  //     MealStart: "01:00PM",
  //     MealEnd: "01:30PM",
  //     WorkEnd: "05:30PM",
  //   },
  // ]);

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
      if (e.target.value === "AM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "AM");
      } else if (e.target.value === "PM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "PM");
      } else {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + e.target.value);
      }
    };

    const onChange = e => {
      console.log("onChange");
      setValue(e.target.value);
    };

    const onChangeSelect = value => {
      console.log("onChangeSelect");
      setValue(value);
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

    const onBlurForEmployee = e => {
      console.log("onBlurForEmployee");
      let employee = employeeInfo.find(
        employee => value === employee.FirstName + " " + employee.LastName
      );
      if (employee) {
        updateEmployeeData(index, id, value);
      } else {
        alert("No exist employee name.");
        updateEmployeeData(index, id, value);
      }
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "Trade") {
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
      // let laborDate = (
      //   (new Date(row.values.WorkEnd) -
      //     new Date(row.values.WorkStart) -
      //     (new Date(row.values.MealStart) - new Date(row.values.MealEnd))) /
      //   3600000
      // ).toFixed(2);

      return <div className="text-right">{laborDate}</div>;
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
    console.log(name);
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
        Trade: "Project Manager",
        WorkStart: "07:00AM",
        MealStart: "12:00PM",
        MealEnd: "01:00PM",
        WorkEnd: "05:00PM",
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
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
  }, [selectedDate]);

  const handleSaveTimesheetBtn = () => {
    let check = data.find(employee => employee.EmployeeID === 0);

    if (check) {
      alert("Cannot save. Please check again employee name");
    } else {
      const fetchData = async () => {
        for (let i = 0; i < data.length; i++) {
          const result = await axios({
            method: "put",
            url: `/api/timesheet/${data[i].TimesheetID}`,
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
          console.log(result);
        }
      };

      fetchData();
    }
  };

  return (
    <>
      <div className="responsiveFlex timesheetAndDate">
        {console.log(data)}
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

var countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central Arfrican Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauro",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre & Miquelon",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St Kitts & Nevis",
  "St Lucia",
  "St Vincent",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks & Caicos",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
//
export default Timesheet;
