import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#F50057",
    },

    error: {
      main: red.A400,
    },

    background: {
      default: "#FFFFFF",
    },
  },
});

export default theme;
