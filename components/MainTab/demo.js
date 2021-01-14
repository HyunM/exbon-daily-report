import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Router from "next/router";

const SimpleTabs = ({ tapNo, projectState, main }) => {
  return (
    <AppBar position="static">
      <Tabs value={tapNo}>
        <Tab
          label={main ? "" : "Timesheet"}
          onClick={() => Router.push(`/timesheet/${projectState}`)}
          disableRipple={true}
          disabled={main}
        />
        <Tab
          label={main ? "" : "Task Completion"}
          onClick={() => Router.push(`/task-completion/${projectState}`)}
          disableRipple={true}
          disabled={main}
        />
        <Tab
          label={main ? "" : "Deficiency Log"}
          onClick={() => Router.push(`/deficiency-log/${projectState}`)}
          disableRipple={true}
          disabled={main}
        />
      </Tabs>
    </AppBar>
  );
};

export default SimpleTabs;
