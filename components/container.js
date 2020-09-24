import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import TabsForDesktop from "./tabsForDesktop";
import TabsForTablet from "./tabsForTablet";

let isPreviousTabletView;

const container = () => {
  const handleTabChange = (event, newValue) => {
    setTapNumber(newValue);
  };

  const [tapNumber, setTapNumber] = useState(0);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  //re
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      isPreviousTabletView = isTabletOrMobile;
      // do componentDidUpdate logic
    }
  });
  return (
    <div>
      {console.log("render")}
      {console.log("isPreviousTabletView")}
      {console.log(isPreviousTabletView)}
      {!isTabletOrMobile &&
        (!isPreviousTabletView ? (
          <TabsForDesktop
            tapNumber={tapNumber}
            handleTabChange={handleTabChange}
          ></TabsForDesktop>
        ) : tapNumber === 0 || tapNumber === 1 ? (
          <TabsForDesktop
            tapNumber={tapNumber}
            handleTabChange={handleTabChange}
          ></TabsForDesktop>
        ) : (
          <TabsForDesktop
            tapNumber={1}
            handleTabChange={handleTabChange}
          ></TabsForDesktop>
        ))}
      {isTabletOrMobile &&
        (isPreviousTabletView ? (
          <TabsForTablet
            tapNumber={tapNumber}
            handleTabChange={handleTabChange}
          ></TabsForTablet>
        ) : tapNumber === 0 ? (
          <TabsForTablet
            tapNumber={0}
            handleTabChange={handleTabChange}
          ></TabsForTablet>
        ) : (
          <TabsForTablet
            tapNumber={2}
            handleTabChange={handleTabChange}
          ></TabsForTablet>
        ))}
    </div>
  );
};

export default container;
