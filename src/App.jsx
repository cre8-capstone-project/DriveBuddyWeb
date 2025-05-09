import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { AuthProvider } from "./utils/AuthProvider";
import { MainLayout } from "./layouts/MainLayout";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { ServerError } from "./pages/ServerError";
import { useAuth } from "./utils/AuthProvider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { CssBaseline } from "@mui/material";
import AuthenticationOptions from "./pages/AuthenticationOptions";
import { BrowserProvider } from "./BrowserProvider";
import { Manage } from "./pages/Manage";
import { Profile } from "./pages/Profile";
import { DriverDetails } from "./pages/DriverDetails";

function App() {
  return (
    // Wrapped with ThemeProvider to apply theme.js styles
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <BrowserProvider>
            <ProtectedRoutes />
          </BrowserProvider>
        </CssBaseline>
      </ThemeProvider>
    </AuthProvider>
  );
}

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <NotificationsProvider>
        <RouterProvider
          router={createBrowserRouter(
            createRoutesFromElements(
              <>
                {/* No authentication required */}
                <Route
                  path="/enter"
                  element={
                    <AuthenticationOptions title="Welcome to DriveBuddy" />
                  }
                />
                <Route path="/signin" element={<SignIn title="Sign In" />} />
                <Route path="/signup" element={<SignUp title="Sign Up" />} />

                {/* Authentication required */}
                <Route
                  path="/"
                  element={user ? <MainLayout /> : <Navigate to="/signin" />}
                >
                  <Route
                    index
                    path="/"
                    element={<Dashboard title="Dashboard" />}
                  />
                  <Route
                    path="/manage"
                    element={<Manage title="Manage Drivers" />}
                  />
                  <Route
                    path="/profile"
                    element={<Profile title="Company" />}
                  />
                  <Route path="/driver/:id" element={<DriverDetails />} />
                </Route>

                <Route
                  path="/error"
                  element={<ServerError title="Server Error" />}
                />
                <Route path="*" element={<NotFound title="Not Found" />} />
              </>
            )
          )}
        />
      </NotificationsProvider>
    </>
  );
}

export default App;
