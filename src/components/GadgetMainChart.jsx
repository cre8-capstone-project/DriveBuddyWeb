/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { Box, Typography, Grid2 as Grid } from "@mui/material";
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
import PeriodButtonGroup from "./PeriodButtonGroup.jsx";
import "./GadgetMainChart.css";

const GadgetMainChart = ({ title = "" }) => {
  const { user } = useAuth();
  const chartRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [mode, setMode] = useState("week-simple");
  // const [data, setData] = useState([]);
  const [hoursWithDetection, setHoursWithDetection] = useState(0);
  const [alertsRate, setAlertsRate] = useState(0);
  const [mostAlerts, setMostAlerts] = useState(0);
  const [loading, setLoading] = useState(false);
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
      family: "'Figtree', 'Arial', sans-serif",
    },
    theme: theme,
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: true,
        padding: 10,
        titleColor: "#1E3A8A",
        backgroundColor: "#F5F5F5",
        borderColor: "#CCCC",
        borderWidth: 1,
        bodyColor: "#1E3A8A",
        titleFont: { size: 16, weight: 600 },
        bodyFont: { size: 16 },
        caretSize: 5,
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
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderRadius: 5,
        barThickness: 0,
      },
    ],
  });

  const updateChartDataStates = (obj) => {
    const totalSessionHours = parseInt(obj.totalSessionHours);
    const alertPerHour = parseInt(obj.alertPerHour);
    const maxAlertsPerUser = parseInt(obj.maxAlertsPerUser);
    setHoursWithDetection(isNaN(totalSessionHours) ? 0 : totalSessionHours);
    setAlertsRate(isNaN(alertPerHour) ? 0 : alertPerHour);
    setMostAlerts(isNaN(maxAlertsPerUser) ? 0 : maxAlertsPerUser);
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
    if (chartRef && chartRef.current) chartRef.current.resize();
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
    try {
      setLoading(true);
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
      const weeklyAlertsData = Array(7).fill(0);

      const response = await getAverageFaceDetectionHistoryDataByWeek(
        user.company_id,
        startOfCurrentWeek
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
            data: [...weeklyAlertsData], // Create a new array
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
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
    } catch (e) {
      console.log("Error handling weekly view: " + e);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthlyView = async () => {
    try {
      setLoading(true);
      const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);
      const daysInMonth = getDate(endOfCurrentMonth);
      const monthlyAlertsData = Array(daysInMonth).fill(0);

      const response = await getAverageFaceDetectionHistoryDataByMonth(
        user.company_id,
        startOfCurrentMonth
      );
      updateChartDataStates(response);

      response.data.forEach((entry) => {
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
        labels: Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString()
        ),
        datasets: [
          {
            data: [...monthlyAlertsData], // Create a new array
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
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
    } catch (e) {
      console.log("Error handling monthly view: " + e);
    } finally {
      setLoading(false);
    }
  };

  const handleYearlyView = async () => {
    try {
      setLoading(true);
      const endOfCurrentYear = endOfYear(startOfCurrentYear);
      const yearlyAlertsData = Array(12).fill(0);

      const response = await getAverageFaceDetectionHistoryDataByYear(
        user.company_id,
        startOfCurrentYear
      );
      updateChartDataStates(response);

      response.data.forEach((entry) => {
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
            data: [...yearlyAlertsData], // Create a new array
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
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
            max: parseInt(Math.max(...yearlyAlertsData) + 5),
          },
        },
      }));
    } catch (e) {
      console.log("Error handling yearly view: " + e);
    } finally {
      setLoading(false);
    }
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
          rowGap={2}
          sx={{
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4">{title}</Typography>
          <PeriodButtonGroup mode={mode} handleModeChange={handleModeChange} />
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
            padding: "1.2rem",
            textAlign: "left",
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: "0.9rem",
              margin: "0",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Driving hours overview
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{
              flexDirection: {
                xs: "column", // Stack vertically on extra small screens
                sm: "row", // Row layout on small screens and above
              },
              justifyContent: { xs: "center", sm: "space-between" },
              gap: {
                xs: 2, // Add some vertical spacing between stacked items
                sm: 1,
              },
            }}
          >
            <OverviewNumber
              flex={1}
              number={parseInt(hoursWithDetection)}
              label="hours with detection"
              info="Details here"
            />
            <OverviewNumber
              flex={1}
              number={parseInt(alertsRate)}
              label="alerts received/hour"
              info="Details here"
            />
            <OverviewNumber
              flex={1}
              number={parseInt(mostAlerts)}
              label="most alerts by one driver"
              info="Details here"
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
        <Grid
          container
          padding={"0.5rem 0"}
          justifyContent={"flex-start"}
          width={"100%"}
          alignItems={"center"}
          gap={1}
        >
          <span className="chartColorLabel"></span>
          <Typography>Alerts received/hour</Typography>
        </Grid>
      </Box>
    </GadgetBase>
  );
};
GadgetMainChart.propTypes = {
  title: PropTypes.string,
};
export default GadgetMainChart;
