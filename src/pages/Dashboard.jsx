/* eslint-disable no-unused-vars */
// React and Material-UI
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid2 as Grid, useMediaQuery } from "@mui/material";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { useLocation } from "react-router-dom";
import GadgetMainChart from "../components/GadgetMainChart.jsx";
import GadgetDriversList from "../components/GadgetDriversList.jsx";
import "../whiteBackground.css";

export const Dashboard = (props) => {
  const isOneColumn = useMediaQuery("(max-width:1474px)");
  const navigate = useNavigate();

  // Remove hash from URL after Google OAuth redirect
  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  const location = useLocation();
  useEffect(() => {
    setPageTitle(props.title);
    applyBodyClass(location.pathname);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflowY: "auto",
        paddingBottom: "1rem",
      }}
    >
      <Grid container spacing={2} sx={{ width: "100%", padding: "0.5rem" }}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, sm: 12, md: 6 , lg: 7}}> 
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GadgetMainChart title="Average of all drivers" />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5}}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GadgetDriversList title="Individual report" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.propTypes = {
  title: PropTypes.string,
};