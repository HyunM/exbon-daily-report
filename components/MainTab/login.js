import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import ScheduleIcon from "@material-ui/icons/Schedule";
import Typography from "@material-ui/core/Typography";
import styles from "./index.module.css";

import { makeStyles } from "@material-ui/core/styles";
const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © Exbon Development, Inc. "}
      {/* <Link color="inherit" href="https://www.exbon.com/">
        Exbon Development, Inc.
      </Link>{" "} */}
      &nbsp;{new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const Login = () => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: "#fa7000",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();
  return (
    <div className={styles["body"]}>
      <div className={styles["mainDiv"]}>
        <div className={styles["wrapper-upper"]}>
          <Avatar className={classes.avatar}>
            <ScheduleIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            className={styles["wrapper-upper__title"]}
          >
            Daily Report
          </Typography>
        </div>
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

export default Login;
