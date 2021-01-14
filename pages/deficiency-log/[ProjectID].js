import { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./DeficiencyLog.module.css";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Router, { useRouter } from "next/router";
import Head from "next/head";

import SimpleTabs from "../../components/MainTab/demo";

toast.configure();

const DeficiencyLog = (
  {
    // projectState,
    // setProjectState,
    // employeeInfo,
    // setPreviousProject,
  }
) => {
  const router = useRouter();
  const projectState = router.query.ProjectID;

  const [data, setData] = useState(() => []);

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/project-deficiency-log?projectID=${projectState}`,
        timeout: 1000, // 5 seconds timeout
        headers: {},
      });

      setData(result.data);
    };

    trackPromise(fetchData());

    // setPreviousProject(projectState);
  }, [projectState]);

  const today = new Date()
    .toLocaleString({
      timeZone: "America/Los_Angeles",
    })
    .split(",")[0];

  const saveInspectionRecord = () => {
    const problem = document.getElementById("TextFieldForProblem").value;
    const actionTaken = document.getElementById("TextFieldForActionTaken")
      .value;

    const fetchData = async () => {
      axios({
        method: "post",
        url: `/api/project-deficiency-log/problem-and-action-taken`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        data: {
          ProjectID: projectState,
          Date: today,
          Problem: problem,
          ActionTaken: actionTaken,
        },
      });
    };
    fetchData();
    toast.success(
      <div className={styles["alert__complete"]}>
        <strong>Save Complete</strong>
      </div>,
      {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      }
    );

    axios({
      method: "post",
      url: `/api/log-daily-reports`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        EmployeeID: employeeInfo.EmployeeID,
        ProjectID: projectState,
        Date: today,
        Category: "DeficiencyLog",
        Action: "update",
      },
    });
  };

  const { promiseInProgress } = usePromiseTracker();
  const goMain = () => {
    Router.push({
      pathname: "/home",
      query: { tab: "deficiency-log", project: projectState },
    });
  };

  return (
    <>
      <Head>
        <title>Daily Report</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SimpleTabs tapNo={2} projectState={projectState} main={false} />
      <div id={styles.mainDiv}>
        {promiseInProgress || !projectState ? (
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader type="Audio" color="#4e88de" height="100" width="100" />
          </div>
        ) : (
          <>
            <h3 className={styles["project-id"]}>
              Project ID :{" "}
              <span onClick={goMain} className={styles["project-id__value"]}>
                {projectState}
              </span>
            </h3>
            {/* <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography variant="h5" color="primary">
                Safety Report
              </Typography>
            </AccordionSummary>
            <div className={styles["safety-report__dropzone-wrapper"]}>
              <DropzoneArea
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                previewGridProps={{
                  container: { spacing: 1, direction: "row" },
                }}
                previewChipProps={{ classes: { root: classes.previewChip } }}
                previewText="Selected files"
              />
            </div>
            <Divider />
            <AccordionActions>
              <Button size="small" color="primary">
                Upload
              </Button>
            </AccordionActions>
          </Accordion> */}
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
              >
                <Typography variant="h5" color="primary">
                  Deficiency Log
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles["inspection-record__wrapper"]}>
                  <div
                    className={
                      styles["inspection-record__wrapper__description"]
                    }
                  >
                    <TextField
                      id="TextFieldForProblem"
                      label="Problem"
                      multiline
                      rows={6}
                      defaultValue={
                        data[0] === undefined ? "" : data[0].Problem
                      }
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div
                    className={styles["inspection-record__wrapper__between"]}
                  ></div>
                  <div
                    className={styles["inspection-record__wrapper__resolution"]}
                  >
                    <TextField
                      id="TextFieldForActionTaken"
                      label="Action Taken"
                      multiline
                      rows={6}
                      defaultValue={
                        data[0] === undefined ? "" : data[0].ActionTaken
                      }
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
              </AccordionDetails>
              <Divider />
              <AccordionActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={saveInspectionRecord}
                >
                  Save
                </Button>
              </AccordionActions>
            </Accordion>
            {/* <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
            >
              <Typography variant="h5" color="primary">
                Memo
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles["memo__wrapper"]}>
                <TextField
                  id="TextFieldForMemo"
                  multiline
                  rows={4}
                  defaultValue={data[0] === undefined ? "" : data[0].Memo}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button size="small" color="primary" onClick={saveMemo}>
                Save
              </Button>
            </AccordionActions>
          </Accordion> */}
          </>
        )}
      </div>
    </>
  );
};

export default DeficiencyLog;
