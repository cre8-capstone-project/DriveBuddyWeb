import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
  doc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useAuth } from "../utils/AuthProvider";
import { generateInvitationCode } from "../utils/utils";
import "./DriverManagement.css";

const DriverManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const driversCollectionRef = collection(firestore, "driver");
  const invitationCollectionRef = collection(firestore, "invitations");
  const [drivers, setDrivers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
  });
  const fetchInvitations = async () => {
    try {
      // Create a reference to the drivers collection

      const invitationsQuery = query(
        invitationCollectionRef,
        where("company_id", "==", user.company_id)
      );

      // Execute the query
      const querySnapshot = await getDocs(invitationsQuery);

      // Create an array to store the documents
      const dbData = [];

      // Loop through the documents and add them to the array
      querySnapshot.forEach((doc) => {
        dbData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setInvitations(dbData);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      throw error;
    }
  };
  const fetchDrivers = async () => {
    try {
      // Create a reference to the drivers collection
      const driversQuery = query(
        driversCollectionRef,
        where("company_id", "==", user.company_id)
      );

      // Execute the query
      const querySnapshot = await getDocs(driversQuery);

      // Create an array to store the documents
      const dbData = [];

      // Loop through the documents and add them to the array
      querySnapshot.forEach((doc) => {
        dbData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setDrivers(dbData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchDrivers();
        await fetchInvitations();
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpen = (
    driver = { id: null, name: "", email: "", phone: "" }
  ) => {
    setFormData(driver);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (formData.id) {
      setDrivers(drivers.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      const newDriver = { ...formData, id: drivers.length + 1 };
      // Send invitation email via Firebase Function
      const functions = getFunctions();
      const sendDriverInvitation = httpsCallable(
        functions,
        "sendDriverInvitation"
      );
      const invitationCode = generateInvitationCode();
      try {
        const result = await sendDriverInvitation({
          email: newDriver.email,
          name: newDriver.name,
          code: invitationCode,
        });
        // The response data is in result.data
        console.log("Invitation email sent successfully:", result.data);
        await addDoc(invitationCollectionRef, {
          company_id: user.company_id,
          createdAt: serverTimestamp(),
          invitation_code: invitationCode,
          recipient_name: newDriver.name,
          recipient_email: newDriver.email,
          status: "pending",
        });
        await fetchInvitations();
      } catch (error) {
        console.error("Failed to send email:");
        console.log(error);
      }
    }
    handleClose();
  };

  const handleDelete = (selectedDriverID) => {
    setDrivers(drivers.filter((d) => d.id !== selectedDriverID));
  };
  const handleCancelInvitation = async (selectedInvitationID) => {
    try {
      const invitationRef = doc(firestore, "invitations", selectedInvitationID);
      await deleteDoc(invitationRef);
      console.log("Invitation deleted successfully.");
      await fetchInvitations();
    } catch (e) {
      console.error("Error deleting invitation:", e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Driver
        </Button>
      </Box>

      <TableContainer component={Paper} style={{ marginTop: 2 }}>
        <Table>
          <TableHead className="">
            <TableRow>
              <StyledTableCell className="tableHeaderCell">
                Name
              </StyledTableCell>
              <StyledTableCell className="tableHeaderCell">
                Email
              </StyledTableCell>
              <StyledTableCell className="tableHeaderCell">
                Phone
              </StyledTableCell>
              <StyledTableCell className="tableHeaderCell">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <StyledTableCell>{driver.name}</StyledTableCell>
                <StyledTableCell>{driver.email}</StyledTableCell>
                <StyledTableCell>{driver.phone}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => navigate(`/driver/${driver.id}`)}
                    color="primary"
                  >
                    View
                  </Button>
                  <Button onClick={() => handleOpen(driver)} color="primary">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(driver.id)}
                    color="secondary"
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{ marginTop: 2 }}>
        <Table>
          <TableHead className="">
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Date Sent</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <StyledTableCell>{invitation.recipient_name}</StyledTableCell>
                <StyledTableCell>{invitation.recipient_email}</StyledTableCell>
                <StyledTableCell>
                  {/*invitation.createdAt
                    ? invitation.createdAt.toDate().toLocaleString()
                    : null*/}
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    fontWeight: "lighter",
                    fontStyle: "italic",
                    color: "gray",
                    textTransform: "capitalize",
                  }}
                >
                  {invitation.status}
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => handleCancelInvitation(invitation.id)}
                    color="secondary"
                    disabled={invitation.status === "accepted"}
                  >
                    Cancel
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Edit Driver" : "Add Driver"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverManagement;
