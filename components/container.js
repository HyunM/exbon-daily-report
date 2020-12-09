import { useState } from "react";
import TabsOfBoth from "./TabsOfBoth";

const Container = ({ employeeInfo, assignedProject, handleLogout }) => {
  // const isTabletOrMobileDevice = useMediaQuery({
  //   query: "(max-device-width: 1224px)",
  // });
  // console.log(props.cookies);
  const [tapNumber, setTapNumber] = useState(1);
  const handleChangeTabs = (event, newValue) => {
    if (newValue !== 3) {
      setTapNumber(newValue);
    }
  };

  return (
    <TabsOfBoth
      tapNumber={tapNumber}
      handleChangeTabs={handleChangeTabs}
      employeeInfo={employeeInfo}
      assignedProject={assignedProject}
      handleLogout={handleLogout}
    ></TabsOfBoth>
  );
};

export default Container;
