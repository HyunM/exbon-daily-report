import Timesheet from "./main/Timesheet";
import Task from "./main/Task";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./Tab/TabPanel";
import a11yProps from "./Tab/a11yProps";
import Miscellaneous from "./main/Miscellaneous";

const TabsOfBoth = ({ tapNumber, handleChangeTabs }) => {
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
