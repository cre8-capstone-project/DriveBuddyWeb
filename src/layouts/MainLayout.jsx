/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { Footer } from "../components/Footer";
import theme from "../theme";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useAuth } from "../utils/AuthProvider.jsx";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Notifications from "../components/Notifications.jsx";
import drivebuddyLogoDesktop from "../assets/icon-drive-buddy-white.png";
import drivebuddyLogoMobile from "../assets/icon-drive-buddy-white.png";
import "./MainLayout.css";

// Links to display in the left Navbar
const NavBar = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    segment: "manage",
    title: "Manage Drivers",
    icon: <PersonAddAltOutlinedIcon />,
  },
  {
    segment: "profile",
    title: "Profile",
    icon: <PersonOutlineOutlinedIcon />,
  },
];

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleSignOut } = useAuth();
  useEffect(() => {
    console.log(user);
    console.log(user?.name, user?.email, user?.company);
  }, [user]);

  // Session State from Toolpad Core
  const [session, setSession] = useState({
    user: {
      name: user?.name || "",
      email: user?.email || "",
      image: "",
    },
  });

  // Use useMediaQuery to define screen width
  const isMobile = useMediaQuery("(max-width:600px)");

  // Set logo source based on screen size
  const logoSource = isMobile ? drivebuddyLogoMobile : drivebuddyLogoDesktop;

  // Authentication logic from Toolpad Core
  const authentication = useMemo(() => {
    return {
      signIn: () => {
        navigate("/");
      },
      signOut: () => {
        handleSignOut();
        navigate("/enter");
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
          <Box
            sx={{
              margin: 2,
              minHeight: "calc(100vh - 180px)",
            }}
          >
            <Outlet />
            <Footer />
          </Box>
        </DashboardLayout>
      </AppProvider>
    </>
  );
};
