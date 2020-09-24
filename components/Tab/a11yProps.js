const a11yProps = index => {
  return {
    refer: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

export default a11yProps;
