import React from "react";
import styles from "./TabsOfBoth.module.css";
import { Button } from "@material-ui/core";

const home = () => {
  return (
    <div className={styles["wrapper-select-project"]}>
      <h3 className={styles["projectID-text"]}>Project ID</h3>
      <select
        id="select-project"
        className={styles["wrapper-select-project__select-project"]}
        // defaultValue={previousProject}
      >
        {/* {assignedProject.map((item) => {
          return <option key={item.ProjectID}>{item.ProjectID}</option>;
        })} */}
        <option key={1}>1</option>
      </select>
      <Button
        // onClick={handleProjectState}
        color="primary"
        className={styles["wrapper-select-project__btn-go"]}
      >
        Go
      </Button>
    </div>
  );
};

export default home;
