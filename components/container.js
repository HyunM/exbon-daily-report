import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import TabsOfDesktop from "./TabsOfDesktop";
import TabsOfTablet from "./TabsOfTablet";

const Container = () => {
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  const [tapNumber, setTapNumber] = useState(0);
  const handleChangeTabs = (event, newValue) => {
    setTapNumber(newValue);
  };

  return (
    <div>
      {!isTabletOrMobileDevice && (
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
      )}
    </div>
  );
};

export default Container;
