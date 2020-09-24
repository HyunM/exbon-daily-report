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
        Item One Item Two
      </TabPanel>
      <TabPanel tapNumber={tapNumber} index={1}>
        Item Three Item Four
      </TabPanel>
    </>
  );
};

export default TabsOfDesktop;
