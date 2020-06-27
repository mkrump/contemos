import { createMuiTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

const theme = createMuiTheme({
  palette: {
    primary: indigo,
  },
});

export default responsiveFontSizes(theme);
