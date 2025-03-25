/* eslint-disable no-unused-vars */
// Reat and Material-UI
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Common Components
//import { useAuth } from "../utils/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { useLocation } from "react-router-dom";
import DriverManagement from "../components/DriverManagement";
import "../whiteBackground.css";

export const Manage = (props) => {
  //const { user } = useAuth();
  const user = {};
  const navigate = useNavigate();

  // Remove hash from URL after Google OAuth redirect
  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  // Initialization
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
      <DriverManagement />
    </Box>
  );
};

Manage.propTypes = {
  title: PropTypes.string,
};
