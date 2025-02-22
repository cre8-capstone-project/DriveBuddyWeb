import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { setPageTitle } from "../utils/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider.jsx";
import { logInWithEmailAndPassword } from "../firebase/auth.js";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import logo from "../assets/react.svg";

export const SignIn = (props) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialization
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  // Transition to Dashboard when user authentication is successful

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const user = await logInWithEmailAndPassword(email, password);

      if (!user) {
        throw new Error("No user with those credentials");
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("User failed to signed in: ", error);
    }
  };
  return (
    <Grid container>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ margin: "0 auto", textAlign: "center" }}>
            {/* Logo */}
            <Box sx={{ mb: 1 }}>
              <img src={logo} alt="DriveBuddy Logo" width={60} />
            </Box>

            {/* Welcome message */}
            <Typography
              variant="h4"
              sx={{
                width: "60%",
                lineHeight: 1.2,
                margin: "0 auto",
                marginBottom: 2,
              }}
            >
              Welcome back!
            </Typography>

            <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
              Sign In
            </Typography>

            <Box sx={{ width: { xs: "60%", sm: "50%" }, margin: "0 auto" }}>
              {/* Email & Password Sign In Form */}
              <Box
                component="form"
                noValidate
                onSubmit={handleSignIn}
                sx={{ mt: 1 }}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  sx={{ marginTop: 1 }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  sx={{ marginTop: 1 }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}

                <Button type="submit" variant="contained" sx={{ mt: 1, mb: 2 }}>
                  Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        <Box sx={{ mx: 4 }}>
          {/* Start Here link */}
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Don&apos;t have an account?{" "}
            <Button
              variant="text"
              color="primary"
              component={NavLink}
              to="/signup"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                margin: "0",
                padding: "0",
              }}
            >
              Start here
            </Button>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

SignIn.propTypes = {
  title: PropTypes.string,
};
