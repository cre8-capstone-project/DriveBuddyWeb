/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { NavLink } from "react-router-dom";
import logo from "../assets/DriveBuddyLogoName.svg";
import "../gradientBackground.css";

export function AuthenticationOptions(props) {
  const location = useLocation();
  useEffect(() => {
    setPageTitle(props.title);
    applyBodyClass(location.pathname);
  }, []);

  // Use useMediaQuery to define screen width
  const isMobile = useMediaQuery("(max-width:600px)");

  // Set the width based on screen size
  const setWidth = isMobile ? "100%" : "60%";

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: 4,
            boxSizing: "border-box",
            overflow: "auto",
          }}
        >
          {/* Logo */}
          <Box sx={{ marginBottom: 1 }}>
            <img src={logo} alt="DriveBuddy Logo" width={150} />
          </Box>

          {/* Welcome message */}
          <Typography variant="h2" sx={{ marginBottom: 1 }}>
            Welcome to DriveBuddy
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            align="center"
            sx={{ width: setWidth, marginBottom: 3 }}
          >
            DriveBuddy is a mobile app for ride-share and long-haul drivers to
            help them stay alert and safe while driving.
          </Typography>

          {/* Button linking to CreateProgram.jsx */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: 1 }}
            component={NavLink}
            to="/signup"
          >
            Sign Up
          </Button>

          {/* Sign In link */}
          <Typography variant="body2">
            Already have an account?{" "}
            <Button
              variant="text"
              color="primary"
              component={NavLink}
              to="/signin"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              Log In
            </Button>
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
}

export default AuthenticationOptions;
