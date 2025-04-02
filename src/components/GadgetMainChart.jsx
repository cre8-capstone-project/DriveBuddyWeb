/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid2 as Grid,
  CircularProgress,
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
  getAverageFaceDetectionHistoryDataByDay,
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
  const modeRef = useRef(mode);
  const [hoursWithDetection, setHoursWithDetection] = useState(0);
  const [alertsRate, setAlertsRate] = useState(0);
  const [mostAlerts, setMostAlerts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [startOfCurrentWeek, setStartOfCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
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
        callbacks: {
          title: function () {
            return "Total";
          },
          label: function (context) {
            const index = context.dataIndex;
            const rawDate = context.chart.data.datasets[0].data[index];
            let formattedDate = "N/A";
            if (modeRef.current === "year-simple") {
              formattedDate = format(parseISO(rawDate), "MMM yyyy");
            } else {
              formattedDate = format(parseISO(rawDate), "MMM dd, yyyy");
            }

            const hour = String(index).padStart(2, "0");
            const time = `${hour}:00`;
            const fullDateTime = rawDate ? `${formattedDate} ${time}` : "N/A";

            const alerts = context.chart.data.datasets[1].data[index];

            if (modeRef.current === "day-simple") {
              return [
                `${alerts ?? 0} alerts received/hour`,
                `${fullDateTime ?? "N/A"}`,
              ];
            } else if (modeRef.current === "year-simple") {
              return [
                `${alerts ?? 0} alerts received/hour`,
                `${formattedDate ?? "N/A"}`,
              ];
            } else {
              return [
                `${alerts ?? 0} alerts received/hour`,
                `${formattedDate ?? "N/A"}`,
              ];
            }
          },
        },
        displayColors: false,
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
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Alerts received/Hour",
        data: [0, 0, 0, 0, 0, 0, 0],
        //backgroundColor: theme.palette.primary.main,
        fillColor:
          "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,255,255,1) 12%, rgba(17,30,68,1) 100%)",
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
    setCurrentDay(today);
    setStartOfCurrentWeek(startOfWeek(today, { weekStartsOn: 0 }));
    setStartOfCurrentMonth(startOfMonth(today));
    setStartOfCurrentYear(startOfYear(today));
  }, [mode]);

  // Switch chart views between week, month, and year
  useEffect(() => {
    console.log("[DEBUG] Mode changed to: " + mode);
    if (mode === "day-simple") {
      handleDailyView();
    } else if (mode === "week-simple") {
      handleWeeklyView();
    } else if (mode === "month-simple") {
      handleMonthlyView();
    } else if (mode === "year-simple") {
      handleYearlyView();
    }
  }, [currentDay, startOfCurrentWeek, startOfCurrentMonth, startOfCurrentYear]);

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
      modeRef.current = newMode;
    }
  };
  const handleDailyView = async () => {
    try {
      setLoading(true);
      const dailyAlertsData = Array.from({ length: 24 }, () => ({
        date: null,
        alerts: 0,
      }));

      const response = await getAverageFaceDetectionHistoryDataByDay(
        user.company_id,
        currentDay
      );
      updateChartDataStates(response);
      console.log(response);
      response.data.forEach((entry) => {
        const hourOfDay = parseInt(entry.date.split(" ")[1].split(":")[0], 10);
        dailyAlertsData[hourOfDay].alerts = entry.alertPerHour;
        dailyAlertsData[hourOfDay].date = entry.date;
      });
      const newChartData = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString()),
        datasets: [
          {
            label: "Dates",
            data: dailyAlertsData.map((data) => data.date),
            hidden: true, // Hide this dataset from the chart
          },
          {
            label: "Alerts",
            data: dailyAlertsData.map((data) => data.alerts),
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderRadius: 5,
            // barThickness: 5,
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
            max: parseInt(Math.max(...dailyAlertsData) + 5),
          },
        },
      }));
    } catch (e) {
      console.log("Error handling daily view: " + e);
    } finally {
      setLoading(false);
    }
  };
  const handleWeeklyView = async () => {
    try {
      setLoading(true);
      // const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
      const weeklyAlertsData = Array.from({ length: 7 }, () => ({
        date: null,
        alerts: 0,
      }));

      const response = await getAverageFaceDetectionHistoryDataByWeek(
        user.company_id,
        startOfCurrentWeek
      );
      updateChartDataStates(response);
      console.log(response);
      response.data.forEach((entry) => {
        const entryDate = parseISO(entry.date);
        const dayOfWeek = (parseInt(format(entryDate, "e")) - 1 + 7) % 7;
        weeklyAlertsData[dayOfWeek].alerts = entry.alertPerHour;
        weeklyAlertsData[dayOfWeek].date = entry.date;
      });
      const newChartData = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
          {
            label: "Dates",
            data: weeklyAlertsData.map((data) => data.date),
            hidden: true, // Hide this dataset from the chart
          },
          {
            label: "Alerts",
            data: weeklyAlertsData.map((data) => data.alerts),
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderRadius: 5,
            // barThickness: 5,
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
      const monthlyAlertsData = Array.from({ length: daysInMonth }, () => ({
        date: null,
        alerts: 0,
      }));

      const response = await getAverageFaceDetectionHistoryDataByMonth(
        user.company_id,
        startOfCurrentMonth
      );
      updateChartDataStates(response);
      console.log(response);
      response.data.forEach((entry) => {
        const entryDate = parseISO(entry.date);
        const dayOfMonth = getDate(entryDate) - 1;
        monthlyAlertsData[dayOfMonth].alerts = entry.alertPerHour;
        monthlyAlertsData[dayOfMonth].date = entry.date;
      });
      const newChartData = {
        labels: Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString()
        ),
        datasets: [
          {
            label: "Dates",
            data: monthlyAlertsData.map((data) => data.date),
            hidden: true, // Hide this dataset from the chart
          },
          {
            label: "Alerts",
            data: monthlyAlertsData.map((data) => data.alerts),
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderRadius: 5,
            // barThickness: 5,
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
      const yearlyAlertsData = Array.from({ length: 12 }, () => ({
        date: null,
        alerts: 0,
      }));

      const response = await getAverageFaceDetectionHistoryDataByYear(
        user.company_id,
        startOfCurrentYear
      );
      updateChartDataStates(response);
      console.log(response);
      response.data.forEach((entry) => {
        const entryDate = parseISO(entry.date);
        const monthOfYear = getMonth(entryDate);
        yearlyAlertsData[monthOfYear].alerts = entry.alertPerHour;
        yearlyAlertsData[monthOfYear].date = entry.date;
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
            label: "Dates",
            data: yearlyAlertsData.map((data) => data.date),
            hidden: true, // Hide this dataset from the chart
          },
          {
            label: "Alerts",
            data: yearlyAlertsData.map((data) => data.alerts),
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderRadius: 5,
            // barThickness: 5,
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
    if (["day-basic", "day-simple"].includes(mode)) {
      setCurrentDay((prev) => addDays(prev, 1));
    } else if (["week-basic", "week-simple"].includes(mode)) {
      setStartOfCurrentWeek((prev) => addDays(prev, 7));
    } else if (mode === "month-simple") {
      setStartOfCurrentMonth((prev) => addMonths(prev, 1));
    } else if (mode === "year-simple") {
      setStartOfCurrentYear((prev) => addMonths(prev, 12));
    }
  };

  const handlePrevious = () => {
    if (["day-basic", "day-simple"].includes(mode)) {
      setCurrentDay((prev) => addDays(prev, -1));
    } else if (["week-basic", "week-simple"].includes(mode)) {
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
              info="The time one driver spent driving (while DriveBuddy’s drowsiness detection was active) - on average for all drivers."
            />
            <OverviewNumber
              flex={1}
              number={parseInt(alertsRate)}
              label="alerts received/hour"
              info="The average number of alerts received per hour by one driver - on average for all drivers."
            />
            <OverviewNumber
              flex={1}
              number={parseInt(mostAlerts)}
              label="most alerts by one driver"
              info="The maximum number of alerts received by one driver during this period."
            />
          </Grid>
        </Box>
        <Box
          sx={{
            height: "300px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : chartData && chartData.datasets && chartData.datasets[0].data ? (
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
