import React from "react";
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

const useStyles = makeStyles(theme =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
  })
);

const Miscellaneous = () => {
  const classes = useStyles();

  return (
    <div id={styles.mainDiv}>
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
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
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
            <div className={styles["inspection-record__wrapper__description"]}>
              <TextField
                label="Description"
                multiline
                rows={6}
                defaultValue=" "
                variant="outlined"
                fullWidth
              />
            </div>
            <div
              className={styles["inspection-record__wrapper__between"]}
            ></div>
            <div className={styles["inspection-record__wrapper__resolution"]}>
              <TextField
                label="Resolution"
                multiline
                rows={6}
                defaultValue=" "
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size="small" color="primary">
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
              multiline
              rows={4}
              defaultValue=" "
              variant="outlined"
              fullWidth
            />
          </div>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size="small" color="primary">
            Save
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
};

export default Miscellaneous;
