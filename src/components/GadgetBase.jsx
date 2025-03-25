import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

export const GadgetBase = ({
  title = null,
  frame = true,
  children,
  sx = {},
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: frame ? 2 : 0,
        borderRadius: "10px",
        backgroundColor: frame ? "rgba(255, 255, 255, .8)" : "transparent",
        border: "1px solid #CCCCCC",
        ...sx,
      }}
    >
      {title && <Typography variant="h6">{title}</Typography>}
      {children}
    </Paper>
  );
};

GadgetBase.propTypes = {
  title: PropTypes.string,
  frame: PropTypes.bool,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
