import { useParams, useNavigate } from "react-router-dom";
import { Button, Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
export const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Create a reference to the drivers collection
        const docRef = doc(firestore, "driver", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
        setDriver(docSnap.data());
      } catch (error) {
        console.error("Error fetching drivers:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
        {loading ? (
          ""
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              {driver.name}
            </Typography>
            <Typography>Email: {driver.email}</Typography>
            <Typography>Phone: {driver.phone}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
