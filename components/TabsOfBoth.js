import Timesheet from "./main/Timesheet";
import Task from "./main/Task";
import { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./Tab/TabPanel";
import a11yProps from "./Tab/a11yProps";
import DeficiencyLog from "./main/DeficiencyLog";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styles from "./TabsOfBoth.module.css";
import { Button } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EventIcon from "@material-ui/icons/Event";
const TabsOfBoth = ({
  tapNumber,
  handleChangeTabs,
  employeeInfo,
  assignedProject,
  handleLogout,
}) => {
  const [projectState, setProjectState] = useState(0);
  const [previousProject, setPreviousProject] = useState(
    assignedProject[0] ? assignedProject[0].ProjectID : ""
  );
  const handleProjectState = () => {
    setProjectState(document.getElementById("select-project").value);
  };

  const toZeroProjectState = () => {
    setProjectState(0);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSchedule = () => {
    window.open(
      `https://dailyreport.exbon.com/calendar/${employeeInfo.EmployeeID}`
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      {!projectState ? (
        <>
          <AppBar position="static">
            <Tabs
              value={0}
              onChange={handleChangeTabs}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
            >
              <Tab label="" disabled {...a11yProps(0)} />
              <Tab label="" disabled {...a11yProps(1)} />
              <Tab label="" disabled {...a11yProps(2)} />
              <Tab
                icon={
                  <div className={styles["wrapper-right-tab"]}>
                    <p className={styles["wrapper-right-tab__employee-name"]}>
                      {employeeInfo.FullName}
                    </p>
                    <AccountCircle
                      className={styles["wrapper-right-tab__account-icon"]}
                    />
                  </div>
                }
                className={styles["right-tab"]}
                aria-describedby={id}
                onClick={handleClick}
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  className={styles["wrapper-schedule"]}
                  onClick={handleSchedule}
                >
                  <EventIcon />
                  &emsp;
                  <Button className={styles["wrapper-schedule__btn"]}>
                    Schedule
                  </Button>
                </div>
                <div
                  className={styles["wrapper-logout"]}
                  onClick={handleLogout}
                >
                  <ExitToAppIcon />
                  &emsp;
                  <Button className={styles["wrapper-logout__btn"]}>
                    Logout
                  </Button>
                </div>
              </Popover>
            </Tabs>
          </AppBar>
          <div className={styles["wrapper-select-project"]}>
            <h3 className={styles["projectID-text"]}>Project ID</h3>
            <select
              id="select-project"
              className={styles["wrapper-select-project__select-project"]}
              defaultValue={previousProject}
            >
              {assignedProject.map((item) => {
                return <option key={item.ProjectID}>{item.ProjectID}</option>;
              })}
            </select>
            <Button
              onClick={handleProjectState}
              color="primary"
              className={styles["wrapper-select-project__btn-go"]}
            >
              Go
            </Button>
          </div>
        </>
      ) : (
        <>
          <AppBar position="static">
            <Tabs
              value={tapNumber}
              onChange={handleChangeTabs}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Timesheet" {...a11yProps(0)} />
              <Tab label="Task Completion" {...a11yProps(1)} />
              <Tab label="Deficiency Log" {...a11yProps(2)} />
              <Tab
                icon={
                  <div className={styles["wrapper-right-tab"]}>
                    <p className={styles["wrapper-right-tab__employee-name"]}>
                      {employeeInfo.FullName}
                    </p>
                    <AccountCircle
                      className={styles["wrapper-right-tab__account-icon"]}
                    />
                  </div>
                }
                className={styles["right-tab"]}
                aria-describedby={id}
                onClick={handleClick}
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  className={styles["wrapper-logout"]}
                  onClick={handleLogout}
                >
                  <ExitToAppIcon />
                  <Button className={styles["wrapper-logout__btn"]}>
                    Logout
                  </Button>
                </div>
              </Popover>
            </Tabs>
          </AppBar>
          <TabPanel tapNumber={tapNumber} index={0}>
            <Timesheet
              projectState={projectState}
              setProjectState={toZeroProjectState}
              employeeInfo={employeeInfo}
              setPreviousProject={setPreviousProject}
            />
          </TabPanel>
          <TabPanel tapNumber={tapNumber} index={1}>
            <Task
              projectState={projectState}
              setProjectState={toZeroProjectState}
              employeeInfo={employeeInfo}
              setPreviousProject={setPreviousProject}
            />
          </TabPanel>
          <TabPanel tapNumber={tapNumber} index={2}>
            <DeficiencyLog
              projectState={projectState}
              setProjectState={toZeroProjectState}
              employeeInfo={employeeInfo}
              setPreviousProject={setPreviousProject}
            />
          </TabPanel>
        </>
      )}
    </>
  );
};

export default TabsOfBoth;
