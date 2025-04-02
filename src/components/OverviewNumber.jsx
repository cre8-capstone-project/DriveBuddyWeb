import { Grid2 as Grid, Typography, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export const OverviewNumber = ({
  label = "label",
  number = 0,
  info = "title",
}) => {
  return (
    <Grid
      sx={{
        flex: {
          xs: "1 1 100%", // Take full width on xs screens
          sm: 1, // Flex 1 on sm screens and above
        },
        width: {
          xs: "100%", // Full width on xs screens
          sm: "auto", // Auto width on sm screens and above
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontSize: "1.9rem", fontWeight: "700" }}
      >
        {number}
      </Typography>
      <Grid container spacing={1} flexWrap={"nowrap"}>
        <Typography
          variant="body1"
          sx={{ fontSize: "0.8rem", fontWeight: "lighter" }}
        >
          {label}
        </Typography>
        <Tooltip title={info} arrow>
          <Typography
            variant="body1"
            sx={{ fontSize: "0.2rem", fontWeight: "lighter" }}
          >
            <HelpOutlineIcon />
          </Typography>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
OverviewNumber.propTypes = {
  label: PropTypes.string,
  number: PropTypes.number,
  info: PropTypes.string,
};
