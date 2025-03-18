/* eslint-disable no-unused-vars */
// React and Material-UI
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid2 as Grid, Skeleton } from "@mui/material";
import { setPageTitle } from "../utils/utils";
import GadgetMainChart from "../components/GadgetMainChart.jsx";
import GadgetDriversList from "../components/GadgetDriversList.jsx";

export const Dashboard = (props) => {
  const [mostAlertsReceivedByDriver, setMostAlertsReceivedByDriver] = useState(
    {}
  );
  const navigate = useNavigate();

  // Remove hash from URL after Google OAuth redirect
  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setPageTitle(props.title);
  }, [props.title]);

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
        <Grid xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GadgetMainChart
              externalDataSource={mostAlertsReceivedByDriver}
              title="Average driver"
            />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid xs={12} md={4} flexGrow={1}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GadgetDriversList
              title="Individual report"
              setExternalData={setMostAlertsReceivedByDriver}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.propTypes = {
  title: PropTypes.string,
};
