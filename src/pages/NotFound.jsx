/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { setPageTitle } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

export const NotFound = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">Not Found</Typography>
        <Typography variant="body1">This page does not exist</Typography>
        <Box>
          <Button variant="contained" onClick={() => navigate("/dashboard")}>
            Back to home
          </Button>
        </Box>
      </Box>
    </>
  );
};
