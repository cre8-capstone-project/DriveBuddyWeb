/* eslint-disable no-unused-vars */
// Reat and Material-UI
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Common Components
//import { useAuth } from "../utils/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { GadgetBase } from "../components/GadgetBase";
import "../whiteBackground.css";

export const Profile = (props) => {
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
    applyBodyClass(location.pathname);
  }, []);

  return (
    <GadgetBase sx={{ justifyContent: "flex-start", width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", fontSize: "1.7rem" }}
        >
          Company
        </Typography>
      </Box>
    </GadgetBase>
  );
};

Profile.propTypes = {
  title: PropTypes.string,
};
