import React from "react";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";
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

const Timesheet = () => {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toLocaleString({
      timeZone: "America/Los_Angeles",
    })
  );

  console.log(selectedDate);
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  return (
    <>
      <h1>Timesheet</h1>
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

      <div className="halfTable">
        <TimesheetTable />
      </div>
    </>
  );
};

const TimesheetTable = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Employee Name",
        accessor: "employeeName",
        maxWidth: 1,
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

  // const data = React.useMemo(
  //   () => [
  //     {
  //       employeeName: "Hyunmyung",
  //       trade: "Sheet Metal",
  //       workFrom: "7am10m",
  //       workTo: "5",
  //     },
  //     {
  //       firstName: "John",
  //       lastName: "Doe",
  //     },
  //   ],
  //   []
  // );

  const [data, setData] = React.useState(() => [
    {
      employeeName: "Hyunmyung",
      trade: "Sheet Metal",
      workFrom: "07:00AM",
      mealFrom: "12:00PM",
      mealTo: "01:00PM",
      workTo: "05:00PM",
      laborHours: "9",
    },
    {
      employeeName: "John Doe",
      trade: "Project Manager",
      workFrom: "06:00AM",
      mealFrom: "12:00PM",
      mealTo: "02:00PM",
      workTo: "08:00PM",
      laborHours: "12",
    },
    {
      employeeName: "Jane Doe",
      trade: "Project Manager",
      workFrom: "08:00AM",
      mealFrom: "12:00PM",
      mealTo: "12:00PM",
      workTo: "11:30AM",
      laborHours: "3.5",
    },
    {
      employeeName: "Baby Doe",
      trade: "Sheet Metal",
      workFrom: "07:10AM",
      mealFrom: "12:00PM",
      mealTo: "12:40PM",
      workTo: "03:30PM",
      laborHours: "7.66",
    },
    {
      employeeName: "Johnny Doe",
      trade: "Roofer",
      workFrom: "11:00AM",
      mealFrom: "05:00PM",
      mealTo: "06:00PM",
      workTo: "10:00PM",
      laborHours: "10",
    },
    {
      employeeName: "Richard Roe",
      trade: "Roofer",
      workFrom: "07:30AM",
      mealFrom: "01:00PM",
      mealTo: "01:30PM",
      workTo: "17:30PM",
      laborHours: "9.5",
    },
  ]);

  // Create an editable cell renderer
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

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    if (id === "trade") {
      return (
        // <Select native value={value} onChange={onChange} onBlur={onBlur}>
        <select value={value} onChange={onChange} onBlur={onBlur}>
          <option value={10}>Project Manager</option>
          <option value={20}>Roofer</option>
          <option value={30}>Sheet Metal</option>
        </select>
      );
    }

    return (
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="tableInput"
      />
    );
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
  return (
    <Table stickyHeader aria-label="sticky table">
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
  );
};

export default Timesheet;
