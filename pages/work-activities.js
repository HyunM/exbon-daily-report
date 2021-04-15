import { useState, useMemo, useEffect } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import SimpleTabs from "../components/MainTab/MainTab";
import NotPermission from "../components/MainTab/NotPermission";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Login from "../components/MainTab/login.js";
import { useTable, usePagination } from "react-table";
import styles from "./WorkActivities.module.css";
import SaveIcon from "@material-ui/icons/Save";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#3E3F42",
    },
  },
  overrides: {
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: "#303235",
        color: "white",
      },
      iconButton: {
        backgroundColor: "transparent",
        color: "white",
      },
      dayLabel: {
        color: "white", //days in calendar
      },
      transitionContainer: {
        color: "white",
      },
    },
    MuiPickersBasePicker: {
      pickerView: {
        backgroundColor: "#3E3F42",
      },
    },
    MuiPickersDay: {
      day: {
        color: "white", //days in calendar
      },
      daySelected: {
        backgroundColor: "#FFC561", //calendar circle
        color: "black",
      },
      current: {
        backgroundColor: "#736F69",
        color: "white",
      },
    },

    MuiDialogActions: {
      root: {
        backgroundColor: "#3E3F42",
      },
    },
  },
});

const workActivities = () => {
  const router = useRouter();
  const [projectState, setProjectState] = useState(undefined);
  const [stateAssignedProject, setStateAssignedProject] = useState([]);
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Contractor",
        accessor: "Contractor",
      },
      {
        Header: "Work Activities",
        accessor: "WorkActivity",
      },
      {
        Header: "Manpower",
        columns: [
          {
            Header: "Super",
            accessor: "Super",
          },
          {
            Header: "Labor",
            accessor: "Labor",
          },
        ],
      },
      {
        Header: "Equipment Utilization",
        accessor: "Equipment",
      },
      {
        Header: "Work Performed",
        accessor: "WorkPerformed",
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const resetData = () => setData(originalData);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
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

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination
  );

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

  const signin = async (username, password) => {
    await axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 1000000, // 5 seconds timeout
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

  useEffect(() => {
    let promises = [];

    if (!router.isReady) return;
    const fetchData = async () => {
      if (status.cookies.username !== 0) {
        if (status.cookies.username !== undefined) {
          await axios({
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

      if (status.permission === true && projectState !== undefined) {
        router.push(`?pid=${projectState}`);
        setData([
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
          {
            Contractor: "TEST Contractor",
            WorkActivity: "TEST WorkActivity",
            Super: 15.5,
            Labor: 10.5,
            Equipment: "TEST Equipment",
            WorkPerformed: "TEST Work Performed",
          },
        ]);
      } else {
        setData([]);
      }
    };

    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  }, [projectState, status, router.isReady]);

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
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <Login signin={signin} />
      ) : (
        <>
          <SimpleTabs
            tapNo={1}
            projectState={projectState}
            main={false}
            employeeID={status.cookies.employeeid}
            employeeName={status.cookies.fullname}
            logout={logout}
          />
          <h1 className={styles["title"]}>Work Activities</h1>
          <div className={styles["header"]}>
            <div className={styles["header__left"]}>
              <select
                value={projectState}
                onChange={e => setProjectState(e.target.value)}
                style={{
                  marginBottom: "3px",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "medium",
                  display: "inline-block",
                  color: "#74646e",
                  border: "1px solid #c8bfc4",
                  borderRadius: "4px",
                  boxShadow: "inset 1px 1px 2px #ddd8dc",
                  background: "#fff",
                  zIndex: "1",
                  position: "relative",
                }}
              >
                {stateAssignedProject.map(item => {
                  return (
                    <option
                      value={item.ProjectID}
                      key={item.ProjectID}
                      projectgroup={item.ProjectGroup}
                      projectname={item.ProjectName}
                    >
                      {item.ProjectID} &emsp;[{item.ProjectGroup}]&ensp;
                      {item.ProjectName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles["header__right"]}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={styles["header__right__save-btn"]}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MuiThemeProvider theme={materialTheme}>
                  <DatePicker
                    margin="normal"
                    id="datePickerDialog"
                    format="MM/dd/yyyy"
                    className={styles["header__right__date-picker"]}
                    autoOk={true}
                    okLabel=""
                  />
                </MuiThemeProvider>
              </MuiPickersUtilsProvider>
              <p className={styles["header__right__label-date-picker"]}>Date</p>
            </div>
          </div>

          <div id={styles.mainDiv}>
            <div>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
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
              <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>{" "}
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {">"}
                </button>{" "}
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>{" "}
                <span>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <span>
                  | Go to page:{" "}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "100px" }}
                  />
                </span>{" "}
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <input></input>
              <input></input>
              <input></input>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default workActivities;
