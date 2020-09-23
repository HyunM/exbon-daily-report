import { useState } from "react";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const Index = () => {
  const [content, setContent] = useState(0);
  const handleChange = (event, newValue) => {
    setContent(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={content} onChange={handleChange} aria-label="tabs">
          <Tab label="Timesheet" {...a11yProps(0)} />
          <Tab label="Self-Perforemd Tasks" {...a11yProps(1)} />
          <Tab label="Subcontractor Tasks" {...a11yProps(2)} />
          <Tab label="Not Fixed" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={content} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={content} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={content} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={content} index={3}>
        Item Four
      </TabPanel>
    </>
  );
};

const TabPanel = props => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={4}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = index => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

export default Index;
