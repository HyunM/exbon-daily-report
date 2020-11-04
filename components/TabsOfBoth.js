import Timesheet from "./main/Timesheet";
import SubcontractorTask from "./main/SubcontractorTask";
import SelfPerformedTask from "./main/SelfPerformedTask";

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
          <Tab label="Self-Performed Tasks" {...a11yProps(1)} />
          <Tab label="Subcontractor Tasks" {...a11yProps(2)} />
          <Tab label="Miscellaneous" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel tapNumber={tapNumber} index={0}>
        <Timesheet />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={1}>
        <SelfPerformedTask />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={2}>
        <SubcontractorTask />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={3}>
        <Miscellaneous />
      </TabPanel>
    </>
  );
};

export default TabsOfBoth;
