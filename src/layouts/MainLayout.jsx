/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { Footer } from "../components/Footer";
import theme from "../theme";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
//import { useAuth } from "../utils/AuthProvider.jsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import Notifications from "../components/Notifications.jsx";
import bodybuddyLogoDesktop from "../assets/react.svg";
import bodybuddyLogoMobile from "../assets/react.svg";
import "./MainLayout.css";

// Links to display in the left Navbar
const NavBar = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "manage",
    title: "Manage Drivers",
    icon: <DriveEtaIcon />,
  },
  {
    segment: "profile",
    title: "Profile",
    icon: <PersonIcon />,
  },
];

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const { user, handleSignOut } = useAuth();
  const user = {};

  // Session State from Toolpad Core
  const [session, setSession] = useState({
    user: {
      name: "User",
      email: "user@test.com",
      image: "",
    },
  });

  // Use useMediaQuery to define screen width
  const isMobile = useMediaQuery("(max-width:600px)");

  // Set logo source based on screen size
  const logoSource = isMobile ? bodybuddyLogoMobile : bodybuddyLogoDesktop;

  // Authentication logic from Toolpad Core
  const authentication = useMemo(() => {
    return {
      signIn: () => {
        navigate("/dashboard");
      },
      signOut: () => {
        //handleSignOut();
        navigate("/");
      },
    };
  }, []);

  // Router object that holds the current URL information
  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      navigate(path);
    },
  };

  return (
    <>
      <AppProvider
        theme={theme}
        branding={{
          logo: <img src={logoSource} alt="DriveBuddy" />,
          title: "DriveBuddy",
        }}
        session={session}
        authentication={authentication}
        navigation={NavBar}
        router={router}
      >
        <DashboardLayout
          disableCollapsibleSidebar
          slots={{ toolbarActions: Notifications }}
          sx={{ position: "relative" }}
        >
          <Box sx={{ margin: 2, minHeight: "calc(100vh - 180px)" }}>
            <Outlet />
          </Box>
          <Footer />
        </DashboardLayout>
      </AppProvider>
    </>
  );
};
