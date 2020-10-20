import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import TabsOfDesktop from "./TabsOfDesktop";
import TabsOfTablet from "./TabsOfTablet";
import TabsOfBoth from "./TabsOfBoth";

const Container = () => {
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  const [tapNumber, setTapNumber] = useState(1);
  const handleChangeTabs = (event, newValue) => {
    setTapNumber(newValue);
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
      ></TabsOfBoth>
    </>
  );
};

export default Container;
