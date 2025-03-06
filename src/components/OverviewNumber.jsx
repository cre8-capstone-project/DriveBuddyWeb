import { Grid2 as Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export const OverviewNumber = ({ label = "label", number = 0 }) => {
  return (
    <Grid flex={1}>
      <Typography variant="body1" sx={{ fontSize: "3rem", fontWeight: "500" }}>
        {number}
      </Typography>
      <Grid container spacing={1}>
        <Typography
          variant="body1"
          sx={{ fontSize: "0.8rem", fontWeight: "lighter" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "0.5rem", fontWeight: "lighter" }}
        >
          <HelpOutlineIcon />
        </Typography>
      </Grid>
    </Grid>
  );
};
OverviewNumber.propTypes = {
  label: PropTypes.string,
  number: PropTypes.number,
};
