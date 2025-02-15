/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import "./Notifications.css";

import { Button, Divider, Grid2 as Grid, Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";

// Notifications Icon in Header
function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Box role="presentation" onClick={() => toggleDrawer()}>
        <div className="notification-wrapper">
          {unreadNotifications > 0 ? (
            <div className="notification-count">
              <Typography variant="body3">{unreadNotifications}</Typography>
            </div>
          ) : (
            ""
          )}
          <IconButton type="button" aria-label="Notifications">
            <NotificationsIcon
              sx={{
                color: "#353E45",
                "&:hover": {
                  color: "#2D90E0", // changes text color on hover
                },
              }}
            />
          </IconButton>
        </div>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        BackdropProps={{ invisible: true }}
        onClose={() => toggleDrawer()}
      >
        <Toolbar />
        <Box role="presentation">
          <Box
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            padding=".5rem"
            spacing={2}
          >
            <Typography variant="body" sx={{ alignContent: "center" }}>
              Notifications
            </Typography>
            <Button onClick={() => toggleDrawer()}>
              <CloseIcon />
            </Button>
          </Box>
          <Divider />
          <Grid container>
            <Button disabled={notifications.length == 0}>
              <Typography variant="body">Mark all as read</Typography>
            </Button>
          </Grid>
          <Divider />
          <List sx={{ width: { xs: "100vw", sm: "380px", md: "45vw" } }}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    key={index}
                    disablePadding
                    alignItems="flex-start"
                    className={notification.read ? "" : "unread-notification"}
                  >
                    <ListItemButton sx={{ display: "flex", gap: "1rem" }}>
                      <ListItemAvatar></ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                            justifyContent="start"
                          >
                            <Typography
                              component="span"
                              variant="h5"
                              sx={{
                                color: "text.primary",
                                display: "block",
                                fontWeight: 700,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{
                                color: "text.primary",
                                display: "block",
                              }}
                            >
                              {notification.message}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body3"
                              sx={{ color: "text.primary", display: "block" }}
                            >
                              {`${new Date(notification.created_at).toDateString().toLocaleUpperCase()} - ${new Date(notification.created_at).toLocaleTimeString()}`}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Box container textAlign={"center"}>
                <Typography variant="body2">No notifications!</Typography>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
export default Notifications;
