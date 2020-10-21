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
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
const SelfPerformedTask = () => {
  return (
    <>
      <div className="halfTable">
        <SelfPerformedTaskTable />
        <div className="mt-5"></div>
      </div>
    </>
  );
};

const SelfPerformedTaskTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Task",
        accessor: "TaskName",
      },
      {
        Header: "Previous Work %",
        accessor: "PreviousWork",
      },
      {
        Header: "Current Work %",
        accessor: "CurrentWork",
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
      setValue(parseFloat(e.target.value));
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "TaskName") {
      return <div>{value}</div>;
    } else if (id === "PreviousWork") {
      return <div>{value}</div>;
    } else if (id === "CurrentWork") {
      return <input value={value || ""} onChange={onChange} onBlur={onBlur} />;
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/project-self-tasks?selectedDate=${formatDate(selectedDate)}`,
        timeout: 15000, // 15 seconds timeout
        headers: {},
      });

      setData(result.data);
    };

    fetchData();
  }, [selectedDate]);

  return (
    <>
      <div className="responsiveFlex selfPerformedTasksAndDate">
        {console.log("data")}
        {console.log(data)}

        <div className="flex leftTitle">
          <h2 className="mr-5" id="selfPerformedTitle">
            Self-Performed Tasks
          </h2>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            id="selfPerformedTaskCalendar"
            width="5"
          >
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
              className="dateWidth"
            />
          </MuiPickersUtilsProvider>
          <h3 id="selfPerformedTaskProjectID">Project ID : 7</h3>
        </div>

        {dateCheckEditable(selectedDate) && (
          <div className="flex rightTitle">
            <Button
              id="saveSelfPerforemdTaskBtn"
              variant="contained"
              color="primary"
              size="small"
              className="saveBtn"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="tableDiv">
        <TableContainer component={Paper}>
          <Table {...getTableProps()}>
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
    </>
  );
};
export default SelfPerformedTask;
