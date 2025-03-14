/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid2 as Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { GadgetBase } from "./GadgetBase";
import { WeekPicker } from "./WeekPicker";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  isWithinInterval,
  addDays,
  addMonths,
  getDate,
  getMonth,
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

const GadgetDriversList = ({ data = [], title = "" }) => {
  const { user } = useAuth();
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
  const fetchDrivers = async () => {
    try {
      // Fetch drivers first
      const driversResponse = await getDriversByCompany(user.company_id);

      // Set initial drivers state
      setDrivers(driversResponse);
      setTotalNumberOfDrivers(driversResponse.length);
      setStartingPageIndex(1);
      setEndingPageIndex(Math.min(11, driversResponse.length));

      // Then fetch face detection data
      const faceDetectionData = await getFaceDetectionSummaryByWeek(
        user.company_id,
        new Date()
      );

      // Update drivers with face detection data
      updateDriversWithFaceData(driversResponse, faceDetectionData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  };

  // Initialization
  useEffect(() => {
    const loadData = async () => await fetchDrivers();
    loadData();
  }, []);
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
    const updatedDrivers = driversData.map((driver) => {
      const matchingData = faceData.data.find(
        (item) => item.userId === driver.id
      );

      if (matchingData) {
        return {
          ...driver,
          ...matchingData,
        };
      }
      return driver;
    });
    setDrivers(updatedDrivers);
  };

  const handleWeeklyView = async () => {
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
    const weeklyMinutesData = Array(7).fill(0);
    const weeklyCaloriesData = Array(7).fill(0);
    const response = await getFaceDetectionSummaryByWeek(
      user.company_id,
      new Date()
    );
    updateDriversWithFaceData(drivers, response);
    data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentWeek,
          end: endOfCurrentWeek,
        })
      ) {
        const dayOfWeek = (parseInt(format(entryDate, "i")) - 1 + 7) % 7;
        weeklyMinutesData[dayOfWeek] += entry.minutes;
        weeklyCaloriesData[dayOfWeek] += entry.calories;
      }
    });
  };

  const handleMonthlyView = async () => {
    const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);
    const daysInMonth = getDate(endOfCurrentMonth);
    const monthlyMinutesData = Array(daysInMonth).fill(0);
    const monthlyCaloriesData = Array(daysInMonth).fill(0);
    const response = await getFaceDetectionSummaryByMonth(
      user.company_id,
      new Date()
    );
    updateDriversWithFaceData(drivers, response);
    data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentMonth,
          end: endOfCurrentMonth,
        })
      ) {
        const dayOfMonth = getDate(entryDate) - 1;
        monthlyMinutesData[dayOfMonth] += entry.minutes;
        monthlyCaloriesData[dayOfMonth] += entry.calories;
      }
    });
  };

  const handleYearlyView = async () => {
    const endOfCurrentYear = endOfYear(startOfCurrentYear);
    const yearlyMinutesData = Array(12).fill(0);
    const yearlyCaloriesData = Array(12).fill(0);
    const response = await getFaceDetectionSummaryByYear(
      user.company_id,
      new Date()
    );
    updateDriversWithFaceData(drivers, response);
    data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentYear,
          end: endOfCurrentYear,
        })
      ) {
        const monthOfYear = getMonth(entryDate);
        yearlyMinutesData[monthOfYear] += entry.minutes;
        yearlyCaloriesData[monthOfYear] += entry.calories;
      }
    });
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
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="mode"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid #ccc",
                "&.Mui-selected": {
                  borderColor: "lightgray",
                  outline: "none",
                  color: "#1E3A8A",
                  backgroundColor: "white",
                },
                "&:focus": {
                  outline: "none",
                },
              },
            }}
          >
            <ToggleButton
              value="week-simple"
              aria-label="week"
              sx={{
                textTransform: "capitalize",
                padding: "4px 10px",
              }}
            >
              Week
            </ToggleButton>
            <ToggleButton
              value="month-simple"
              aria-label="month"
              sx={{
                textTransform: "capitalize",
                padding: "4px 10px",
              }}
            >
              Month
            </ToggleButton>
            <ToggleButton
              value="year-simple"
              aria-label="month"
              sx={{
                textTransform: "capitalize",
                padding: "4px 10px",
              }}
            >
              Year
            </ToggleButton>
          </ToggleButtonGroup>
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
                {drivers.map((driver, index) => (
                  <TableRow key={index + 1}>
                    <StyledTableCell
                      sx={{ display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Avatar src={driver.picture_url} alt={driver.name} />
                      <Typography>{driver.name}</Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {driver.totalSessionHours
                        ? parseInt(driver.totalSessionHours)
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {driver.alertPerHour
                        ? parseInt(driver.alertPerHour)
                        : "-"}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </GadgetBase>
  );
};
GadgetDriversList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      minutes: PropTypes.number.isRequired,
      user_id: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};
export default GadgetDriversList;
