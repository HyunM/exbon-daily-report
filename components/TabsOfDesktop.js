import Timesheet from "./main/Timesheet";
import SubcontractorTask from "./main/SubcontractorTask";
import SelfPerformedTask from "./main/SelfPerformedTask";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./Tab/TabPanel";
import a11yProps from "./Tab/a11yProps";

const TabsOfDesktop = ({ tapNumber, handleChangeTabs }) => {
  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tapNumber}
          onChange={handleChangeTabs}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="tabs"
        >
          <Tab
            label={
              <>
                Timesheet <br /> Self-Perforemd Tasks
              </>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <>
                Subcontractor Tasks <br /> Not Fixed
              </>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel tapNumber={tapNumber} index={0}>
        <Timesheet /> <SelfPerformedTask />
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={1}>
        <SubcontractorTask />
      </TabPanel>
    </>
  );
};

export default TabsOfDesktop;
