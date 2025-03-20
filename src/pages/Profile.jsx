/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { setPageTitle, applyBodyClass } from "../utils/utils";
import { GadgetBase } from "../components/GadgetBase";
import "../whiteBackground.css";
import { useAuth } from "../utils/AuthProvider";
import { getCompanyByID } from "../api/api";

export const Profile = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (window.location.href.includes("#")) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setPageTitle(props.title);
    applyBodyClass(location.pathname);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      console.log(user);
      const companyData = await getCompanyByID(user.company_id);
      setCompany(companyData);
    };
    loadData();
  }, [user]);

  return (
    <GadgetBase sx={{ justifyContent: "flex-start", width: "100%" }}>
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", fontSize: "1.7rem" }}
        >
          Company
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "none" }}>
        <Table sx={{ border: "none" }}>
          <TableBody>
            {[
              ["Company Name:", company ? company.name : "-"],
              ["Admin Name:", user ? user.name : "-"],
              ["Admin Email:", user ? user.email : "-"],
            ].map(([label, value]) => (
              <TableRow key={label} sx={{ borderBottom: "none" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                    paddingRight: 2,
                  }}
                >
                  {label}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GadgetBase>
  );
};

Profile.propTypes = {
  title: PropTypes.string,
};
