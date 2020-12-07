import { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./Miscellaneous.module.css";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";

toast.configure();

const useStyles = makeStyles(theme =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
  })
);

const Miscellaneous = ({ projectState, setProjectState, employeeInfo }) => {
  const [data, setData] = useState(() => []);

  const classes = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/project-daily-report-misc?projectID=${projectState}`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        // data: {
        //   firstName: "David",
        //   lastName: "Pollock",
        // },
      });

      setData(result.data);
    };

    trackPromise(fetchData());
  }, []);

  const today = new Date()
    .toLocaleString({
      timeZone: "America/Los_Angeles",
    })
    .split(",")[0];

  const saveInspectionRecord = () => {
    const description = document.getElementById("TextFieldForDescription")
      .value;
    const resolution = document.getElementById("TextFieldForResolution").value;

    const fetchData = async () => {
      axios({
        method: "post",
        url: `/api/project-daily-report-misc/description-and-resolution`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        data: {
          ProjectID: projectState,
          Date: today,
          InspectionDescription: description,
          InspectionResolution: resolution,
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
        Category: "Miscellaneous_InspectionRecord",
        Action: "update",
      },
    });
  };

  const saveMemo = () => {
    const memo = document.getElementById("TextFieldForMemo").value;

    const fetchData = async () => {
      axios({
        method: "post",
        url: `/api/project-daily-report-misc/memo`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        data: {
          ProjectID: projectState,
          Date: today,
          Memo: memo,
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
        Category: "Miscellaneous_Memo",
        Action: "update",
      },
    });
  };

  const { promiseInProgress } = usePromiseTracker();

  return (
    <div id={styles.mainDiv}>
      {promiseInProgress ? (
        <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
        </div>
      ) : (
        <>
          <h3 className={styles["project-id"]}>
            Project ID :{" "}
            <span
              onClick={() => {
                setProjectState(0);
              }}
              className={styles["project-id__value"]}
            >
              {projectState}
            </span>
          </h3>
          <Accordion defaultExpanded={false}>
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
          </Accordion>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
            >
              <Typography variant="h5" color="primary">
                Inspection Record
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles["inspection-record__wrapper"]}>
                <div
                  className={styles["inspection-record__wrapper__description"]}
                >
                  <TextField
                    id="TextFieldForDescription"
                    label="Description"
                    multiline
                    rows={6}
                    defaultValue={
                      data[0] === undefined ? "" : data[0].InspectionDescription
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
                    id="TextFieldForResolution"
                    label="Resolution"
                    multiline
                    rows={6}
                    defaultValue={
                      data[0] === undefined ? "" : data[0].InspectionResolution
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
          <Accordion defaultExpanded={true}>
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
          </Accordion>
        </>
      )}
    </div>
  );
};

export default Miscellaneous;
