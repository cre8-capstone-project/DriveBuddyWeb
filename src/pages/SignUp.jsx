/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { setPageTitle } from "../utils/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { signUpWithEmailAndPassword } from "../firebase/auth.js";
import Grid from "@mui/material/Grid2";
import logo from "../assets/icon-drive-buddy-white.png";
import { useAuth } from "../utils/AuthProvider";

export const SignUp = (props) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Initialization
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  // Transition to Dashboard when user authentication is successful
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const user = await signUpWithEmailAndPassword(email, password, {
        name: name,
        company: company,
      });
      if (!user) {
        throw new Error("No user with those credentials");
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error(error);
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
              sx={{ width: "60%", margin: "0 auto", marginBottom: 2 }}
            >
              Welcome to DriveBuddy!
            </Typography>

            <Typography component="h1" variant="h3" sx={{ marginBottom: 1 }}>
              Sign Up
            </Typography>

            <Box sx={{ width: { xs: "60%", sm: "40%" }, margin: "0 auto" }}>
              <Box component="form" noValidate onSubmit={handleSignUp}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                  value={name}
                  sx={{ marginTop: 1 }}
                  onChange={(e) => setName(e.target.value)}
                />
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="company"
                  label="Company"
                  id="company"
                  value={company}
                  sx={{ marginTop: 1 }}
                  onChange={(e) => setCompany(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" sx={{ mt: 1, mb: 2 }}>
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
        <Box sx={{ mx: 4 }}>
          {/* Start Here link */}
          <Typography
            variant="body2"
            sx={{ whiteSpace: "nowrap", marginBottom: 1 }}
          >
            Already have an account?{" "}
            <Button
              variant="text"
              color="primary"
              component={NavLink}
              to="/signin"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                margin: "0",
                padding: "0",
              }}
            >
              Log In
            </Button>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

SignUp.propTypes = {
  title: PropTypes.string,
};
