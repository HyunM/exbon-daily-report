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
      {tapNumber === index && <>{children}</>}
    </div>
  );
};

export default TabPanel;
