import { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import ScheduleIcon from "@material-ui/icons/Schedule";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ContainerMain from "../components/container";
import axios from "axios";
import { sha256 } from "js-sha256";
import styles from "./index.module.css";
import Head from "next/head";
import { CookiesProvider, useCookies } from "react-cookie";

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

const index = () => {
  const [cookies, setCookie, removeCookie] = useCookies("username");
  const [openLoginFormstate, setOpenLoginFormstate] = useState(false);
  const classes = useStyles();
  const [login, setLogin] = useState({
    isLogin: false,
    employeeInfo: [],
    assignedProject: [],
  });

  const handleSignIn = async () => {
    const username = document.getElementById("username").value;
    const password =
      "0x" + sha256(document.getElementById("password").value).toUpperCase();

    await axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        Username: username,
        Password: password,
      },
    }).then((response) => {
      if (response.data.result.recordsets[0].length === 0) {
        alert("Login failed.");
      } else {
        setCookie("username", username, { path: "/", maxAge: 3600 * 24 * 30 });
        setCookie("password", password, { path: "/", maxAge: 3600 * 24 * 30 });
        setLogin({
          isLogin: true,
          employeeInfo: response.data.result.recordsets[0],
          assignedProject: response.data.result.recordsets[1],
        });
      }
    });
  };

  const handleLogout = () => {
    removeCookie("username", { path: "/" });
    removeCookie("password", { path: "/" });
    setLogin({
      isLogin: false,
      employeeInfo: [],
      assignedProject: [],
    });
    setOpenLoginFormstate(true);
  };

  const handleSignInUsingCookie = async () => {
    const username = cookies.username;
    const password = cookies.password;

    await axios({
      method: "post",
      url: `/api/daily-report/signin`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        Username: username,
        Password: password,
      },
    }).then((response) => {
      setCookie("username", username, { path: "/", maxAge: 3600 * 24 * 30 });
      setCookie("password", password, { path: "/", maxAge: 3600 * 24 * 30 });
      setLogin({
        isLogin: true,
        employeeInfo: response.data.result.recordsets[0],
        assignedProject: response.data.result.recordsets[1],
      });
    });
  };

  useEffect(() => {
    if (cookies.username) {
      handleSignInUsingCookie();
    } else {
      setOpenLoginFormstate(true);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };
  return (
    <>
      <CookiesProvider>
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
            employeeInfo={login.employeeInfo[0]}
            assignedProject={login.assignedProject}
            handleLogout={handleLogout}
          ></ContainerMain>
        ) : !openLoginFormstate ? (
          <></>
        ) : (
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
                  onKeyPress={handleKeyPress}
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
              </div>
            </div>
            <Box mt={8}>
              <Copyright />
            </Box>
          </div>
        )}
      </CookiesProvider>
    </>
  );
};

export default index;
