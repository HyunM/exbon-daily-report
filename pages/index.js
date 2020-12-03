import { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ContainerMain from "../components/container";
import axios from "axios";
import { sha256, sha224 } from "js-sha256";
import styles from "./index.module.css";

import Head from "next/head";

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

const useStyles = makeStyles(theme => ({
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

const index = () => {
  const classes = useStyles();
  const [login, setLogin] = useState({
    isLogin: false,
    employeeInfo: [],
    assignedProject: [],
  });

  const handleSignIn = async () => {
    const password =
      "0x" + sha256(document.getElementById("password").value).toUpperCase();
    await axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        Username: document.getElementById("username").value,
        Password: password,
      },
    }).then(response => {
      if (response.data.result.recordsets[0].length === 0) {
        alert("Login failed.");
      } else {
        setLogin({
          isLogin: true,
          employeeInfo: response.data.result.recordsets[0],
          assignedProject: response.data.result.recordsets[1],
        });
      }
    });
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      handleSignIn();
    }
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
      {login.isLogin ? (
        <ContainerMain
          employeeInfo={login.employeeInfo}
          assignedProject={login.assignedProject}
        />
      ) : (
        <Container component="main" maxWidth="xs">
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
                onKeyPress={handleKeyPress}
              />
              {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
            </div>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      )}

      <div id="modalForTasksTab"></div>
    </>
  );
};

export default index;
