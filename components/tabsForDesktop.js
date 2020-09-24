import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography } from "@material-ui/core";

export default function tabsForDesktop({ tapNumber, handleTabChange }) {
  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tapNumber}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="tabs"
        >
          <Tab
            label={
              <>
                Timesheet
                <br /> Self-Perforemd Tasks
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
}

const TabPanel = props => {
  const { children, tapNumber, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={tapNumber !== index}
      refer={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {tapNumber === index && <Typography>{children}</Typography>}
    </div>
  );
};

const a11yProps = index => {
  return {
    refer: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};
