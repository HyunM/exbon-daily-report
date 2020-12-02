import Timesheet from "./main/Timesheet";
import Task from "./main/Task";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./Tab/TabPanel";
import a11yProps from "./Tab/a11yProps";
import Miscellaneous from "./main/Miscellaneous";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styles from "./TabsOfBoth.module.css";

const TabsOfBoth = ({
  tapNumber,
  handleChangeTabs,
  employeeInfo,
  assignedProject,
}) => {
  return (
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
          <Tab label="Tasks" {...a11yProps(1)} />
          <Tab label="Miscellaneous" {...a11yProps(2)} />
          <Tab
            icon={
              <div className={styles["wrapper-right-tab"]}>
                <p className={styles["wrapper-right-tab__employee-name"]}>
                  {employeeInfo[0].FullName}
                </p>
                <AccountCircle
                  className={styles["wrapper-right-tab__account-icon"]}
                />
              </div>
            }
            disabled
            className={styles["right-tab"]}
          />
        </Tabs>
      </AppBar>
      <TabPanel tapNumber={tapNumber} index={0}>
        <Timesheet />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={1}>
        <Task />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={2}>
        <Miscellaneous />
      </TabPanel>
    </>
  );
};

export default TabsOfBoth;
