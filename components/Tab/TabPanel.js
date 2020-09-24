import { Typography } from "@material-ui/core";

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

export default TabPanel;
