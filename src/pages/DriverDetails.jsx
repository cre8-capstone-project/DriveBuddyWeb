import { useParams, useNavigate } from "react-router-dom";
import { Button, Paper, Typography, Box } from "@mui/material";

export const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const drivers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
    },
  ];

  const driver = drivers.find((d) => d.id === parseInt(id));

  if (!driver) {
    return <Typography variant="h6">Driver not found</Typography>;
  }

  return (
    <Paper
      style={{
        padding: 20,
        width: "100%",
        height: "100%",
        margin: "20px auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "start" }}>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          color="primary"
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: "2rem",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {driver.name}
        </Typography>
        <Typography>Email: {driver.email}</Typography>
        <Typography>Phone: {driver.phone}</Typography>
      </Box>
    </Paper>
  );
};
