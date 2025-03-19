/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid2 as Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { GadgetBase } from "./GadgetBase";
import { WeekPicker } from "./WeekPicker";
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  addDays,
  addMonths,
} from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js initialization
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { useAuth } from "../utils/AuthProvider";
import {
  getDriversByCompany,
  getFaceDetectionSummaryByWeek,
  getFaceDetectionSummaryByMonth,
  getFaceDetectionSummaryByYear,
} from "../api/api.js";
import PeriodButtonGroup from "./PeriodButtonGroup.jsx";

const GadgetDriversList = ({ title = "", setExternalData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [startingPageIndex, setStartingPageIndex] = useState(0);
  const [endingPageIndex, setEndingPageIndex] = useState(0);
  const [totalNumberOfDrivers, setTotalNumberOfDrivers] = useState(0);
  const [mode, setMode] = useState("week-simple");

  const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [startOfCurrentMonth, setStartOfCurrentMonth] = useState(
    startOfMonth(new Date())
  );
  const [startOfCurrentYear, setStartOfCurrentYear] = useState(
    startOfYear(new Date())
  );
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.light,
      color: theme.palette.text.gray,
      fontWeight: "700",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  // Initialization
  useEffect(() => {
    const loadData = async () => {
      // Fetch drivers first
      setLoading(true);
      const driversResponse = await getDriversByCompany(user.company_id);

      // Set initial drivers state
      setTotalNumberOfDrivers(driversResponse.length);
      setStartingPageIndex(1);
      setEndingPageIndex(Math.min(11, driversResponse.length));

      // Then fetch face detection data
      const faceDetectionData = await getFaceDetectionSummaryByWeek(
        user.company_id,
        startOfCurrentWeek
      );
      const driversList = [];
      // Update drivers with face detection data
      faceDetectionData.data.forEach((entry) => {
        const driver = driversResponse.find((item) => item.id === entry.userId);
        if (driver) {
          driver.alertPerHour = entry.alertPerHour;
          driver.totalSessionHours = entry.totalSessionHours;
        }
        driversList.push(driver);
      });
      //driversList.sort((a, b) => a.alertPerHour < b.alertPerHour);
      console.log(driversList);
      setDrivers(driversList);
      setLoading(false);
      setExternalData({ mostAlertsReceivedByDriver: 100 });
    };
    loadData();
  }, [setExternalData]);
  // When the mode is changed, reset the start date of the week or month
  useEffect(() => {
    const today = new Date();
    setStartOfCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }));
    setStartOfCurrentMonth(startOfMonth(today));
    setStartOfCurrentYear(startOfYear(today));
  }, [mode]);

  // Switch chart views between week, month, and year
  useEffect(() => {
    if (mode === "week-simple") {
      handleWeeklyView();
    } else if (mode === "month-simple") {
      handleMonthlyView();
    } else if (mode === "year-simple") {
      handleYearlyView();
    }
  }, [startOfCurrentWeek, startOfCurrentMonth, startOfCurrentYear]);

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
    }
  };
  const updateDriversWithFaceData = (driversData, faceData) => {
    try {
      setLoading(true);
      const updatedDrivers = [];
      faceData.data.forEach((entry) => {
        const driver = driversData.find((item) => item.id === entry.userId);
        if (driver) {
          driver.alertPerHour = entry.alertPerHour;
          driver.totalSessionHours = entry.totalSessionHours;
        }
        updatedDrivers.push(driver);
      });
      setDrivers(updatedDrivers);
    } catch (e) {
      console.error("Error updating drivers: " + e);
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklyView = async () => {
    const response = await getFaceDetectionSummaryByWeek(
      user.company_id,
      startOfCurrentWeek
    );
    updateDriversWithFaceData(drivers, response);
  };

  const handleMonthlyView = async () => {
    const response = await getFaceDetectionSummaryByMonth(
      user.company_id,
      startOfCurrentMonth
    );
    updateDriversWithFaceData(drivers, response);
  };

  const handleYearlyView = async () => {
    const response = await getFaceDetectionSummaryByYear(
      user.company_id,
      startOfCurrentYear
    );
    updateDriversWithFaceData(drivers, response);
  };

  const handleNext = () => {
    if (["week-basic", "week-simple"].includes(mode)) {
      setStartOfCurrentWeek((prev) => addDays(prev, 7));
    } else if (mode === "month-simple") {
      setStartOfCurrentMonth((prev) => addMonths(prev, 1));
    } else if (mode === "year-simple") {
      setStartOfCurrentYear((prev) => addMonths(prev, 12));
    }
  };

  const handlePrevious = () => {
    if (["week-basic", "week-simple"].includes(mode)) {
      setStartOfCurrentWeek((prev) => addDays(prev, -7));
    } else if (mode === "month-simple") {
      setStartOfCurrentMonth((prev) => addMonths(prev, -1));
    } else if (mode === "year-simple") {
      setStartOfCurrentYear((prev) => addMonths(prev, -12));
    }
  };
  return (
    <GadgetBase>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Grid
          container
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ width: "100%" }}
        >
          <Typography variant="h4">{title}</Typography>
          <PeriodButtonGroup mode={mode} handleModeChange={handleModeChange} />
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          width={"100%"}
          paddingY={"1rem"}
        >
          <Grid>
            <Typography>
              {startingPageIndex} - {endingPageIndex} of {totalNumberOfDrivers}
            </Typography>
          </Grid>
          <Grid>
            <WeekPicker
              onClickNextWeek={handleNext}
              onClickPreviousWeek={handlePrevious}
              displayMode={mode}
            />
          </Grid>
        </Grid>
        <Box sx={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Driver</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    Hours driving
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    Alerts/Hour
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : drivers && drivers.length > 0 ? (
                  drivers.map((driver, index) => (
                    <TableRow key={index + 1}>
                      <StyledTableCell
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        {loading ? (
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <>
                            <Avatar
                              src={
                                driver?.picture_url ? driver.picture_url : ""
                              }
                              alt={driver?.name ? driver.name : ""}
                            />
                            <Typography>
                              {driver?.name ? driver.name : ""}
                            </Typography>
                          </>
                        )}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        {loading ? (
                          <>
                            <Skeleton variant="rectangular" />
                          </>
                        ) : driver?.totalSessionHours ? (
                          parseInt(driver.totalSessionHours)
                        ) : (
                          "0"
                        )}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        {loading ? (
                          <>
                            <Skeleton variant="rectangular" />
                          </>
                        ) : driver?.alertPerHour ? (
                          parseInt(driver.alertPerHour)
                        ) : (
                          "0"
                        )}
                      </StyledTableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        Could not find any drivers.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </GadgetBase>
  );
};
GadgetDriversList.propTypes = {
  setExternalData: PropTypes.func,
  title: PropTypes.string,
};
export default GadgetDriversList;
