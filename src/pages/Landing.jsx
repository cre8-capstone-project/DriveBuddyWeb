import { useState, useEffect } from "react";
import theme from "../theme";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/icon-drive-buddy-white.png";
import "./Landing.css";
import { setPageTitle } from "../utils/utils";

export function Landing() {
  const [menuActive, setMenuActive] = useState(false);
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleMenuClick = () => {
    setMenuActive((currentState) => !currentState);
  };
  // Scroll handler
  // eslint-disable-next-line no-unused-vars
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    setPageTitle("DriveBuddy");
  }, []);
  return (
    <>
      <AppBar
        position="fixed"
        className="toolbar"
        sx={{
          backgroundColor: "rgba(255,255,255,1)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box className="toolbar-content-wrapper">
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                gap: "0.5rem",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <a href="#">
                <img src={logo} id="app-logo" />
              </a>
              <Typography
                variant="h3"
                color="text.primary"
                sx={{ fontWeight: 700 }}
              >
                DriveBuddy
              </Typography>
            </Box>
            <Box sx={{ flexGrow: "1", justifyContent: { xs: "end" } }}>
              {/* Desktop Links */}
              <Box
                component="nav"
                id="menu"
                className={[
                  isMdUp ? "" : "mobile-menu",
                  menuActive ? "active" : "",
                ]}
                sx={{
                  fontWeight: 600,
                  "& a": {
                    color: "text.primary",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  },
                }}
              >
                <Link to="#about">About Us</Link>
                <Link color="primary" to="#features">
                  Features
                </Link>
                <Link color="primary" to="#pricing">
                  Pricing
                </Link>
                <Link color="primary" to="#team">
                  Team
                </Link>
                <Link color="primary" to="#contact">
                  Contact
                </Link>
              </Box>

              {/* Mobile Menu Icon */}
              <IconButton
                color="primary"
                aria-label="menu"
                aria-controls="menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{
                  display: { xs: "flex", md: "none", justifySelf: "right" },
                }}
              >
                <MenuIcon />
              </IconButton>
              {/* Mobile Menu */}
            </Box>
            <Box>
              <Link to="/enter">
                <Button
                  variant="contained"
                  sx={{
                    // textTransform: "uppercase",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  Sign in
                </Button>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        id="landing-page-content"
        sx={{ justifyContent: "center", alignContent: "center" }}
      >
        <Typography variant="h1" color="text.dark">
          Marketing page content
        </Typography>
      </Box>
      <Box
        component="footer"
        sx={{ backgroundColor: "#212121", width: "100%", padding: "1rem" }}
      >
        <Container>
          <Typography variant="body2" color="primary.contrastText">
            DriveBuddy 2025 &copy; All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default Landing;
