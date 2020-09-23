import { useState } from "react";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography } from "@material-ui/core";
import { useMediaQuery } from "react-responsive";

const Index = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const [tapNumber, setTapNumber] = useState(0);
  const [tabletMode, setTabletMode] = useState(isTabletOrMobile);
  const handleChangeFromDesktop = (event, newValue) => {
    setTapNumber(newValue);
  };
  const handleChangeFromTablet = (event, newValue) => {
    setTapNumber(newValue);
  };

  const changeTabletMode = boolean => {
    setTabletMode(boolean);
  };

  return (
    // <div>
    //   <h1>Device Test!</h1>
    //   {isDesktopOrLaptop && (
    //     <>
    //       <p>You are a desktop or laptop</p>
    //       {isBigScreen && <p>You also have a huge screen</p>}
    //       {isTabletOrMobile && (
    //         <p>You are sized like a tablet or mobile phone though</p>
    //       )}
    //     </>
    //   )}
    //   {isTabletOrMobileDevice && <p>You are a tablet or mobile phone</p>}
    //   <p>Your are in {isPortrait ? "portrait" : "landscape"} orientation</p>
    //   {isRetina && <p>You are retina</p>}
    // </div>
    <div>
      {!isTabletOrMobile &&
        (tapNumber === 2 || tapNumber === 3 ? ( //from tablet mode to desktop mode
          <>
            <AppBar position="static">
              <Tabs
                value={0}
                onChange={handleChangeFromDesktop}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="tabs"
              >
                <Tab
                  label="Timesheet &nbsp Self-Perforemd Tasks"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Subcontractor Tasks + Not Fixed"
                  {...a11yProps(1)}
                />
              </Tabs>
            </AppBar>
            <TabPanel tapNumber={0} index={0}>
              Item One Item Two
            </TabPanel>
            <TabPanel tapNumber={0} index={1}>
              Item Three Item Four
            </TabPanel>
          </>
        ) : (
          <>
            <AppBar position="static">
              <Tabs
                value={tapNumber}
                onChange={handleChangeFromDesktop}
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
        ))}
      {isTabletOrMobile && (
        <>
          <AppBar position="static">
            <Tabs
              value={tapNumber}
              onChange={handleChangeFromTablet}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Timesheet" {...a11yProps(0)} />
              <Tab label="Self-Perforemd Tasks" {...a11yProps(1)} />
              <Tab label="Subcontractor Tasks" {...a11yProps(2)} />
              <Tab label="Not Fixed" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <TabPanel tapNumber={tapNumber} index={0}>
            Item One
          </TabPanel>
          <TabPanel tapNumber={tapNumber} index={1}>
            Item Two
          </TabPanel>
          <TabPanel tapNumber={tapNumber} index={2}>
            Item Three
          </TabPanel>
          <TabPanel tapNumber={tapNumber} index={3}>
            Item Four
          </TabPanel>
        </>
      )}
    </div>
  );
};

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

export default Index;
