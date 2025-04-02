/* eslint-disable no-unused-vars */
// React and Material-UI
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid2 as Grid, Typography, useMediaQuery } from "@mui/material";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { useLocation } from "react-router-dom";
import GadgetMainChart from "../components/GadgetMainChart.jsx";
import GadgetDriversList from "../components/GadgetDriversList.jsx";
import "../whiteBackground.css";
import { useAuth } from "../utils/AuthProvider.jsx";
import { getCompanyByID } from "../api/api.js";
import theme from "../theme.js";

export const Dashboard = (props) => {
  const { user } = useAuth();
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCompany();
  }, [user]);

  const loadCompany = async () => {
    try {
      if (user && user.company_id) {
        let company = await getCompanyByID(user.company_id);
        console.log(company);
        setCompany(company.name);
      } else throw new Error("User is empty or has no company");
    } catch (e) {
      console.log("Error loading company: " + e);
    }
  };
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: "0.5rem",
          paddingBottom: "1rem",
          paddingLeft: "0.5rem",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Typography variant="h1" color={theme.palette.primary.main}>
          Hello, {user ? user.name : "manager"}
        </Typography>
        <Typography variant="body1">
          Here&apos;s your overview for {company}
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", padding: "0.5rem" }}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 7 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GadgetMainChart title="Average of all drivers" />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
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
