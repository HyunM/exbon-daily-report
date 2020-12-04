import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import TabsOfDesktop from "./TabsOfDesktop";
import TabsOfTablet from "./TabsOfTablet";
import TabsOfBoth from "./TabsOfBoth";
import { withCookies, Cookies } from "react-cookie";

const Container = ({ employeeInfo, assignedProject, handleLogout }) => {
  // const isTabletOrMobileDevice = useMediaQuery({
  //   query: "(max-device-width: 1224px)",
  // });
  // console.log(props.cookies);
  const [tapNumber, setTapNumber] = useState(0);
  const handleChangeTabs = (event, newValue) => {
    if (newValue !== 3) {
      setTapNumber(newValue);
    }
  };

  return (
    <>
      {/* {!isTabletOrMobileDevice && (
        <TabsOfDesktop
          tapNumber={tapNumber}
          handleChangeTabs={handleChangeTabs}
        ></TabsOfDesktop>
      )}
      {isTabletOrMobileDevice && (
        <TabsOfTablet
          tapNumber={tapNumber}
          handleChangeTabs={handleChangeTabs}
        ></TabsOfTablet>
      )} */}
      <TabsOfBoth
        tapNumber={tapNumber}
        handleChangeTabs={handleChangeTabs}
        employeeInfo={employeeInfo}
        assignedProject={assignedProject}
        handleLogout={handleLogout}
      ></TabsOfBoth>
    </>
  );
};

export default Container;
