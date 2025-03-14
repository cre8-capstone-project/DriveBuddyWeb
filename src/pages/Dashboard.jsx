/* eslint-disable no-unused-vars */
// Reat and Material-UI
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Common Components
//import { useAuth } from "../utils/AuthProvider.jsx";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Grid2 as Grid,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { setPageTitle } from "../utils/utils";
import theme from "../theme";
import GadgetMainChart from "../components/GadgetMainChart.jsx";
import GadgetDriversList from "../components/GadgetDriversList.jsx";

export const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Remove hash from URL after Google OAuth redirect
  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Initialization
  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflowY: "auto",
        paddingBottom: "1rem",
      }}
    >
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {isMdUp ? (
          <>
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* ADD GADGETS HERE */}
                {loading ? (
                  <>
                    <Box display="flex" gap={2} padding={2}>
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        width={80}
                        height={80}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent={"space-between"}
                        gap={2}
                        flexGrow={1}
                      >
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          width={100}
                          sx={{ marginTop: "10px" }}
                        />
                        <Skeleton animation="wave" variant="rectangular" />
                      </Box>
                    </Box>
                    <Box>
                      <Skeleton
                        animation="wave"
                        width="100%"
                        height="300px"
                        variant="rectangular"
                      />
                    </Box>
                    <Box>
                      <Skeleton
                        animation="wave"
                        width="100%"
                        height="300px"
                        variant="rectangular"
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <GadgetMainChart title="Average driver" />
                  </>
                )}
              </Box>
            </Grid>
            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* ADD GADGETS HERE*/}
                {loading ? (
                  <>
                    <Box>
                      <Skeleton
                        animation="wave"
                        width="100%"
                        height="300px"
                        variant="rectangular"
                      />
                    </Box>
                    <Box>
                      <Skeleton
                        animation="wave"
                        width="100%"
                        height="500px"
                        variant="rectangular"
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <GadgetDriversList title="Individual report" />
                  </>
                )}
              </Box>
            </Grid>
          </>
        ) : (
          <Grid xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <GadgetMainChart data={[]} title="Average driver" />
              <GadgetDriversList data={[]} title="Individual report" />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

Dashboard.propTypes = {
  title: PropTypes.string,
};
