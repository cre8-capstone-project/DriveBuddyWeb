/* eslint-disable no-unused-vars */
// Reat and Material-UI
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Common Components
//import { useAuth } from "../utils/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { setPageTitle } from "../utils/utils";

export const Dashboard = (props) => {
  //const { user } = useAuth();
  const user = {};
  const navigate = useNavigate();
  const location = useLocation();

  // Remove hash from URL after Google OAuth redirect
  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  // Initialization
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" color="text.dark">
        Dashboard content
      </Typography>
    </Box>
  );
};

Dashboard.propTypes = {
  title: PropTypes.string,
};
