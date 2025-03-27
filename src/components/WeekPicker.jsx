import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
  addDays,
  subDays,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export const WeekPicker = ({
  onSelectDate = null,
  onClickNextWeek = null,
  onClickPreviousWeek = null,
  displayMode = "week-basic", // "day-basic", "week-basic", "week-simple, "month-simple"
  scheduledDates = [],
  scheduledDatesBorderColor = "primary.main",
  scheduledDatesBgColor = "transparent",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));
  const [endDate, setEndDate] = useState(
    addDays(getStartOfWeek(new Date()), 6)
  );
  const timeZone = "America/Vancouver";

  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (displayMode === "day-simple") {
      setCurrentDate(today);
      setStartDate(today);
      setEndDate(today);
    } else if (displayMode === "month-simple") {
      setStartDate(startOfMonth(today));
      setEndDate(endOfMonth(today));
    } else if (displayMode === "year-simple") {
      setStartDate(startOfYear(today));
      setEndDate(endOfYear(today));
    } else {
      setStartDate(getStartOfWeek(today).setHours(0, 0, 0, 0));
      setEndDate(addDays(getStartOfWeek(today), 6).setHours(0, 0, 0, 0));
    }
  }, [displayMode]);

  function getStartOfWeek(date) {
    return startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  }

  const handlerNextWeek = () => {
    if (displayMode === "day-simple") {
      setStartDate((prev) => addDays(prev, 1));
      setEndDate((prev) => addDays(prev, 1));
      if (typeof onClickNextWeek === "function") {
        onClickNextWeek(addDays(startDate, 1));
      }
    } else if (displayMode === "month-simple") {
      setStartDate((prev) => startOfMonth(addMonths(prev, 1)));
      setEndDate((prev) => endOfMonth(addMonths(prev, 1)));
      if (typeof onClickNextWeek === "function") {
        onClickNextWeek(addMonths(startDate, 1));
      }
    } else if (displayMode === "year-simple") {
      setStartDate(addMonths(startDate, 12));
      setEndDate(addMonths(endDate, 12));
      if (typeof onClickNextWeek === "function") {
        onClickNextWeek(addMonths(startDate, 12));
      }
    } else {
      setStartDate(addDays(startDate, 7));
      setEndDate(addDays(endDate, 7));
      if (typeof onClickNextWeek === "function") {
        onClickNextWeek(addDays(startDate, 7));
      }
    }
  };

  const handlerPreviousWeek = () => {
    if (displayMode === "day-simple") {
      setStartDate((prev) => addDays(prev, -1));
      setEndDate((prev) => addDays(prev, -1));
      if (typeof onClickPreviousWeek === "function") {
        onClickPreviousWeek(addDays(startDate, -1));
      }
    } else if (displayMode === "month-simple") {
      setStartDate((prev) => startOfMonth(subMonths(prev, 1)));
      setEndDate((prev) => endOfMonth(subMonths(prev, 1)));
      if (typeof onClickPreviousWeek === "function") {
        onClickPreviousWeek(subMonths(startDate, 1));
      }
    } else if (displayMode === "year-simple") {
      setStartDate(subMonths(startDate, 12));
      setEndDate(subMonths(endDate, 12));
      if (typeof onClickPreviousWeek === "function") {
        onClickPreviousWeek(subMonths(startDate, 12));
      }
    } else {
      setStartDate(subDays(startDate, 7));
      setEndDate(subDays(endDate, 7));
      if (typeof onClickPreviousWeek === "function") {
        onClickPreviousWeek(subDays(startDate, 7));
      }
    }
  };

  const handleDayClick = (day) => {
    if (typeof onSelectDate === "function") {
      onSelectDate(day);
    }
  };

  const getWeekdays = (startOfWeek) => {
    return [...Array(7)].map((_, index) => addDays(startOfWeek, index));
  };

  const weekdays = getWeekdays(startDate);

  const isScheduled = (day) => {
    if (!scheduledDates || scheduledDates.length === 0) return false;
    return scheduledDates.some((scheduledDate) => {
      const utcDate = parseISO(scheduledDate);
      const zonedDay = toZonedTime(day, timeZone);
      return isSameDay(utcDate, zonedDay);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Weekly Calendar */}
      <Box
        sx={{
          display: "flex",
          direction: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          flexWrap: "nowrap",
          flexShrink: 1,
        }}
      >
        <IconButton
          sx={{
            padding: 1,
            "&:focus": { outline: "none" },
            "&:hover": { backgroundColor: "#CCCCC" },
            fontSize: "1rem",
          }}
          color="primary"
          onClick={handlerPreviousWeek}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {displayMode === "week-basic" ? (
          weekdays.map((day, index) => (
            <Box
              key={index}
              sx={{
                // cursor: 'pointer',
                textAlign: "center",
              }}
              onClick={() => handleDayClick(day)}
            >
              <Typography>{format(day, "E").charAt(0)}</Typography>
              {/* Day of week */}
              <Typography
                sx={{
                  fontSize: "0.5rem",
                  width: "30px",
                  height: "30px",
                  lineHeight: "30px",
                  border: "1px solid",
                  borderRadius: "50%",
                  borderColor: isSameDay(day, currentDate)
                    ? "secondary.main"
                    : isScheduled(day)
                      ? scheduledDatesBorderColor
                      : "transparent",
                  backgroundColor: isSameDay(day, currentDate)
                    ? "transparent"
                    : isScheduled(day)
                      ? scheduledDatesBgColor
                      : "transparent",
                }}
              >
                {format(day, "dd")}
              </Typography>
              {/* Date */}
            </Box>
          ))
        ) : (
          <Typography sx={{ fontSize: "0.9rem" }}>
            {isSameDay(startDate, endDate)
              ? `${format(startDate, "MMM d, yyyy")}`
              : `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`}
          </Typography>
        )}

        <IconButton
          onClick={handlerNextWeek}
          color="primary"
          size="small"
          sx={{
            padding: 1,
            "&:focus": { outline: "none" },
            "&:hover": { backgroundColor: "#CCCCC" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

WeekPicker.propTypes = {
  onSelectDate: PropTypes.func,
  onClickNextWeek: PropTypes.func,
  onClickPreviousWeek: PropTypes.func,
  displayMode: PropTypes.string,
  scheduledDates: PropTypes.array,
  scheduledDatesBorderColor: PropTypes.string,
  scheduledDatesBgColor: PropTypes.string,
};