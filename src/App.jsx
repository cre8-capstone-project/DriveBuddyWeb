import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./utils/AuthProvider";
import { MainLayout } from "./layouts/MainLayout";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound";
import { ServerError } from "./pages/ServerError";
import { useAuth } from "./utils/AuthProvider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { CssBaseline } from "@mui/material";
import AuthenticationOptions from "./pages/AuthenticationOptions";
import { BrowserProvider } from "./BrowserProvider";
import { Manage } from "./pages/Manage";

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

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* No authentication required */}
        <Route
          path="/enter"
          element={<AuthenticationOptions title="Welcome to DriveBuddy" />}
        />
        <Route path="/signin" element={<SignIn title="Sign In" />} />
        <Route path="/signup" element={<SignUp title="Sign Up" />} />

        {/* Authentication required (MainLayout is applied) */}
        <Route
          path="/"
          element={user ? <MainLayout /> : <Navigate to="/signin" />}
        >
          <Route index path="/" element={<Manage title="Manage Drivers" />} />
        </Route>

        <Route path="/error" element={<ServerError title="Server Error" />} />
        <Route path="*" element={<NotFound title="Not found" />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
