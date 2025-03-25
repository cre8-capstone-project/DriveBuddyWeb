import { ToggleButtonGroup, ToggleButton, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";

const PeriodButtonGroup = ({ mode, handleModeChange }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeChange}
      fullWidth={isMobile} // Default value
      aria-label="mode"
      sx={{
        border: "1px solid #ccc",
        paddingY: 1,
        paddingX: 2,
        gap: 1,
        "& .MuiToggleButton-root": {
          fontWeight: 700,
          border: "1px solid transparent",
          borderRadius: 2,

          "&.Mui-selected": {
            borderColor: "lightgray",
            outline: "none",
            color: "#1E3A8A",
            backgroundColor: "white",
            boxShadow: "0px 1px 5px #cccc",
          },
          "&:focus": {
            outline: "none",
          },
        },
      }}
    >
      <ToggleButton
        value="day-simple"
        aria-label="day"
        sx={{
          textTransform: "capitalize",
          padding: "4px 10px",
        }}
      >
        Day
      </ToggleButton>
      <ToggleButton
        value="week-simple"
        aria-label="week"
        sx={{
          textTransform: "capitalize",
          padding: "4px 10px",
        }}
      >
        Week
      </ToggleButton>
      <ToggleButton
        value="month-simple"
        aria-label="month"
        sx={{
          textTransform: "capitalize",
          padding: "4px 10px",
        }}
      >
        Month
      </ToggleButton>
      <ToggleButton
        value="year-simple"
        aria-label="month"
        sx={{
          textTransform: "capitalize",
          padding: "4px 10px",
        }}
      >
        Year
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default PeriodButtonGroup;
PeriodButtonGroup.propTypes = {
  mode: PropTypes.string,
  handleModeChange: PropTypes.func,
};
