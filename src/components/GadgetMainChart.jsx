/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid2 as Grid,
} from "@mui/material";
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { OverviewNumber } from "./OverviewNumber.jsx";

// Chart.js initialization
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import theme from "../theme.js";
import {
  getAverageFaceDetectionHistoryDataByWeek,
  getAverageFaceDetectionHistoryDataByMonth,
  getAverageFaceDetectionHistoryDataByYear,
} from "../api/api.js";
import { useAuth } from "../utils/AuthProvider.jsx";

const GadgetMainChart = ({ title = "" }) => {
  const { user } = useAuth();
  const chartRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [mode, setMode] = useState("week-simple");
  const [data, setData] = useState([]);
  const [hoursWithDetection, setHoursWithDetection] = useState(0);
  const [alertsRate, setAlertsRate] = useState(0);
  const [mostAlerts, setMostAlerts] = useState(0);
  const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [startOfCurrentMonth, setStartOfCurrentMonth] = useState(
    startOfMonth(new Date())
  );
  const [startOfCurrentYear, setStartOfCurrentYear] = useState(
    startOfYear(new Date())
  );
  const [options, setOptions] = useState({
    font: {
      family: "'Montserrat', 'Arial', sans-serif",
    },
    theme: theme,
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        padding: 10,
        titleColor: "#000",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 1,
        bodyColor: "#000",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 16 },
        caretSize: 10,
        cornerRadius: 15,
        position: "average",
        yAlign: "bottom",
      },
    },
    scales: {
      x: {
        ticks: {
          align: "end",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 70,
      },
    },
    animation: {
      duration: 500,
      easing: "easeInOutQuad",
    },
  });
  const [chartData, setChartData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Alerts received/Hour",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: theme.palette.primary,
        borderColor: "#489FE4",
        borderRadius: 5,
        barThickness: 0,
      },
    ],
  });

  const updateChartDataStates = (obj) => {
    setHoursWithDetection(obj.totalSessionHours);
    setAlertsRate(obj.alertPerHour);
    setData(obj.data);
    setMostAlerts(0);
  };

  // Initialization
  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;
    handleWeeklyView();

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Chart resize
  useEffect(() => {
    chartRef.current.resize();
  }, [windowWidth]);

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

  const handleWeeklyView = async () => {
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
    const weeklyAlertsData = Array(7).fill(0);

    const response = await getAverageFaceDetectionHistoryDataByWeek(
      user.company_id,
      new Date()
    );
    updateChartDataStates(response);

    response.data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentWeek,
          end: endOfCurrentWeek,
        })
      ) {
        const dayOfWeek = (parseInt(format(entryDate, "i")) - 1 + 7) % 7;
        weeklyAlertsData[dayOfWeek] += entry.alertPerHour;
      }
    });
    const newChartData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Alerts/Hour",
          data: [...weeklyAlertsData], // Create a new array
          backgroundColor: "#489FE4",
          borderColor: "#489FE4",
          borderRadius: 5,
          barThickness: 5, // Non-zero value
        },
      ],
    };

    setChartData(newChartData);
    setOptions((prevOptions) => ({
      ...prevOptions,
      scales: {
        ...prevOptions.scales,
        y: {
          ...prevOptions.scales.y,
          max: parseInt(Math.max(...weeklyAlertsData) + 5),
        },
      },
    }));
  };

  const handleMonthlyView = async () => {
    const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);
    const daysInMonth = getDate(endOfCurrentMonth);
    const monthlyAlertsData = Array(daysInMonth).fill(0);

    const response = await getAverageFaceDetectionHistoryDataByMonth(
      user.company_id,
      new Date()
    );
    updateChartDataStates(response);

    data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentMonth,
          end: endOfCurrentMonth,
        })
      ) {
        const dayOfMonth = getDate(entryDate) - 1;
        monthlyAlertsData[dayOfMonth] += entry.alertPerHour;
      }
    });
    const newChartData = {
      labels: Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
      datasets: [
        {
          label: "Alerts/Hour",
          data: [...monthlyAlertsData], // Create a new array
          backgroundColor: "#489FE4",
          borderColor: "#489FE4",
          borderRadius: 5,
          barThickness: 5, // Non-zero value
        },
      ],
    };

    setChartData(newChartData);
    setOptions((prevOptions) => ({
      ...prevOptions,
      scales: {
        ...prevOptions.scales,
        y: {
          ...prevOptions.scales.y,
          max: parseInt(Math.max(...monthlyAlertsData) + 5),
        },
      },
    }));
  };

  const handleYearlyView = async () => {
    const endOfCurrentYear = endOfYear(startOfCurrentYear);
    const yearlyAlertsData = Array(12).fill(0);

    const response = await getAverageFaceDetectionHistoryDataByYear(
      user.company_id,
      new Date()
    );
    updateChartDataStates(response);

    data.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      if (
        isWithinInterval(entryDate, {
          start: startOfCurrentYear,
          end: endOfCurrentYear,
        })
      ) {
        const monthOfYear = getMonth(entryDate);
        yearlyAlertsData[monthOfYear] += entry.alertPerHour;
      }
    });
    const newChartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Alerts/Hour",
          data: [...yearlyAlertsData], // Create a new array
          backgroundColor: "#489FE4",
          borderColor: "#489FE4",
          borderRadius: 5,
          barThickness: 5, // Non-zero value
        },
      ],
    };

    setChartData(newChartData);
    setOptions((prevOptions) => ({
      ...prevOptions,
      scales: {
        ...prevOptions.scales,
        y: {
          ...prevOptions.scales.y,
          max: parseInt(Math.max(...yearlyAlertsData) + 50),
        },
      },
    }));
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
        <Box width={{ md: "100%", lg: "65%" }}>
          <WeekPicker
            onClickNextWeek={handleNext}
            onClickPreviousWeek={handlePrevious}
            displayMode={mode}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: "#E5FFFF",
            borderRadius: "10px",
            padding: "2rem",
            textAlign: "left",
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: "1rem",
              margin: "0",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Driving hours overview
          </Typography>
          <Grid container spacing={2}>
            <OverviewNumber
              number={parseInt(hoursWithDetection)}
              label="hours with detection"
            />
            <OverviewNumber
              number={parseInt(alertsRate)}
              label="alerts received/hour"
            />
            <OverviewNumber
              number={parseInt(mostAlerts)}
              label="most alerts received by one driver"
            />
          </Grid>
        </Box>
        <Box sx={{ height: "300px", width: "100%" }}>
          {chartData && chartData.datasets && chartData.datasets[0].data ? (
            <Bar
              data={chartData}
              options={options}
              key={windowWidth}
              ref={chartRef}
            />
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Box>
    </GadgetBase>
  );
};
GadgetMainChart.propTypes = {
  title: PropTypes.string,
};
export default GadgetMainChart;
