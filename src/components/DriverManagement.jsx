import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
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
  Avatar,
  Typography,
  Box,
  TablePagination,
  Grid2,
  Skeleton,
} from "@mui/material";
//import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useAuth } from "../utils/AuthProvider";
import { generateInvitationCode, capitalizeFirstLetter } from "../utils/utils";
import "./DriverManagement.css";
import { GadgetBase } from "./GadgetBase.jsx";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
  getDriversByCompany,
  getInvitationsByCompany,
  addInvitation,
} from "../api/api.js";
import theme from "../theme.js";

const DriverManagement = () => {
  const { user } = useAuth();
  const notifications = useNotifications();
  //const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.light,
      color: theme.palette.text.gray,
      fontWeight: "700",
      textAlign: "center",
      padding: "0.8rem",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
    },
  }));
  const [drivers, setDrivers] = useState([]);

  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchDriversAndInvitations = async () => {
    try {
      const driversData = await getDriversByCompany(user.company_id);
      if (!driversData)
        throw new Error("Drivers response was empty: " + driversData);
      const invitationsData = await getInvitationsByCompany(user.company_id);
      if (!invitationsData) {
        setDrivers(driversData);
        throw new Error("Invitations response was empty: " + invitationsData);
      }
      const driversWithInvitations = [];

      invitationsData.forEach((invitation) => {
        let driver = driversData.find(
          (item) => item.email == invitation.recipient_email
        );
        if (driver) {
          driver.invitation = { ...invitation };
        } else {
          driver = {
            birthday: null,
            company_id: invitation.recipient_email,
            email: invitation.recipient_email,
            name: invitation.recipient_name,
            picture_url: "",
            invitation: { ...invitation },
          };
        }
        driversWithInvitations.push(driver);
      });
      driversWithInvitations.sort((a, b) => {
        if (
          a.invitation.status === "pending" &&
          b.invitation.status !== "pending"
        ) {
          return -1; // a comes before b
        } else if (
          a.invitation.status !== "pending" &&
          b.invitation.status === "pending"
        ) {
          return 1; // b comes before a
        } else {
          return 0; // no change in order
        }
      });
      setDrivers(driversWithInvitations);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchDriversAndInvitations();
      } catch (error) {
        console.error("Error fetching drivers or invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpen = (driver = { id: null, name: "", email: "" }) => {
    setFormData(driver);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (sendingInvitation) return;
    setSendingInvitation(true);
    if (formData.id) {
      setDrivers(drivers.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      const newDriver = { ...formData, id: drivers.length + 1 };

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
        await addInvitation({
          company_id: user.company_id,
          createdAt: Timestamp.fromDate(new Date()),
          invitation_code: invitationCode,
          recipient_name: newDriver.name,
          recipient_email: newDriver.email,
        });

        setSendingInvitation(false);
        notifications.show("Email sent successfully", {
          severity: "success",
          autoHideDuration: 5000,
        });
        await fetchDriversAndInvitations();
      } catch (error) {
        console.error("Failed to send email:");
        console.log(error);
        notifications.show("Email could not be sent", {
          severity: "error",
          autoHideDuration: 10000,
        });
      }
    }
    handleClose();
  };

  return (
    <GadgetBase sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", fontSize: "1.7rem" }}
        >
          Manage Drivers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Driver
        </Button>
      </Box>
      <Box width={"100%"} height={"100%"}>
        <TableContainer component={Paper} style={{ marginTop: 2 }} width="100%">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell className="tableHeaderCell">
                  Driver Name
                </StyledTableCell>
                <StyledTableCell className="tableHeaderCell">
                  Email
                </StyledTableCell>
                <StyledTableCell className="tableHeaderCell">
                  Status
                </StyledTableCell>
                <StyledTableCell className="tableHeaderCell">
                  Date Invited
                </StyledTableCell>
                <StyledTableCell className="tableHeaderCell">
                  Date Joined
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from([1, 2, 3, 4]).map((index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Grid2
                        display={"flex"}
                        direction={"row"}
                        alignItems={"center"}
                        gap={5}
                        padding={0}
                      >
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={50}
                          height={50}
                          display={"flex"}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          animation="wave"
                          height={25}
                          display={"flex"}
                        />
                      </Grid2>
                    </TableCell>
                  </TableRow>
                ))
              ) : drivers && drivers.length > 0 ? (
                drivers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((driver) => (
                    <TableRow key={driver.id}>
                      <StyledTableCell
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Avatar src={driver.picture_url} alt={driver.name} />
                        <Typography>{driver.name}</Typography>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>
                        {driver.email}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={
                          driver.invitation?.status
                            ? driver.invitation.status == "accepted"
                              ? {
                                  color: theme.palette.success.main,
                                  fontWeight: "bold",
                                }
                              : {
                                  color: theme.palette.primary.main,
                                  fontWeight: "bold",
                                }
                            : {}
                        }
                      >
                        {driver.invitation
                          ? capitalizeFirstLetter(driver.invitation.status)
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {driver.invitation
                          ? driver.invitation.createdAt
                            ? new Timestamp(
                                driver.invitation.createdAt.seconds,
                                driver.invitation.createdAt.nanoseconds
                              )
                                .toDate()
                                .toDateString()
                            : "N/A"
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {driver.invitation
                          ? driver.invitation.acceptedAt
                            ? new Timestamp(
                                driver.invitation.acceptedAt.seconds,
                                driver.invitation.acceptedAt.nanoseconds
                              )
                                .toDate()
                                .toDateString()
                            : "N/A"
                          : "N/A"}
                      </StyledTableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                      There are no drivers in your company.
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                      Click &quot;add drivers&quot; to send an invitation
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          width={"100%"}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={drivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>Add Driver</DialogTitle>
        <DialogContent sx={{ maxWidth: "450px" }}>
          <Typography variant="body2" sx={{ marginY: "0.5rem" }}>
            The driver will receive an email with a 6-digit invitation code to
            fill in when they create an account
          </Typography>
          <form>
            <TextField
              fullWidth
              required
              margin="dense"
              label="Driver name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              margin="dense"
              label="Driver email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={sendingInvitation}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            type="submit"
            disabled={sendingInvitation}
          >
            Send invitation
          </Button>
        </DialogActions>
      </Dialog>
    </GadgetBase>
  );
};

export default DriverManagement;
