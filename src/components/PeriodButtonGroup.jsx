import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import PropTypes from "prop-types";

const PeriodButtonGroup = ({ mode, handleModeChange }) => {
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeChange}
      aria-label="mode"
      sx={{
        "& .MuiToggleButton-root": {
          border: "1px solid #ccc",
          "&.Mui-selected": {
            borderColor: "lightgray",
            outline: "none",
            color: "#1E3A8A",
            backgroundColor: "white",
          },
          "&:focus": {
            outline: "none",
          },
        },
      }}
    >
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
