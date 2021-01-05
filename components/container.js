import { useState } from "react";
import TabsOfBoth from "./TabsOfBoth";
import { useRouter } from "next/router";

const Container = ({ employeeInfo, assignedProject, handleLogout }) => {
  const [tapNumber, setTapNumber] = useState(0);
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
