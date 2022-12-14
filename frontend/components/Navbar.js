import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { getUserIdFromJwtOrUndefined } from "../lib/jwt";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/router";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import firstLetter from "../utils/firstLetter";

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userIsLoggedIn, setUserIsLogggedIn] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const [user, setUser] = useState(undefined);

  const settings = [
    { label: "Your profile", href: `/users/${userId}` },
    { label: "Logout", href: "/logout" },
  ];

  const router = useRouter();
  // Set userId when page loads
  useEffect(async () => {
    const userId = getUserIdFromJwtOrUndefined();
    setUserId(userId);

    if (userId) {
      setUserIsLogggedIn(true);

      const getUser = async () => {
        await axios
          .get(`${BACKEND_URL}/api/users/${userId}`)
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            const errorMessage = error.response.data.error;

            console.log(errorMessage);
          });
      };

      getUser();

      return;
    }

    setUserIsLogggedIn(false);
  }, [router]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                flexGrow: { xs: 1 },
                display: "flex",
                "&:hover": { cursor: "pointer", color: "darkgrey" },
              }}
              data-cy="navbar-index-link"
            >
              HikeLink
            </Typography>
          </Link>

          {/* Let this Box be */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

          <Box sx={{ pr: 4 }}>
            {userIsLoggedIn ? (
              <Link href="/hikes/add" data-cy="navbar-add-hike-link">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "lightgray",
                    color: "black",
                    "&:hover": { backgroundColor: "white" },
                  }}
                  startIcon={<AddIcon />}
                >
                  Add hike
                </Button>
              </Link>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Link href="/login">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "lightgray",
                      color: "black",
                      mx: 1,
                      "&:hover": { backgroundColor: "white" },
                    }}
                    startIcon={<LoginIcon />}
                    data-cy="navbar-login-page-button"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "lightgray",
                      mx: 1,
                      color: "black",
                      "&:hover": { backgroundColor: "white" },
                    }}
                    startIcon={<AddIcon />}
                    data-cy="navbar-register-page-button"
                  >
                    Register
                  </Button>
                </Link>
              </Box>
            )}
          </Box>

          {userId && user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Box
                    sx={{
                      backgroundColor: "lightgray",
                      borderRadius: "50%",
                      overflow: "hidden",
                      borderStyle: "solid",
                      borderWidth: "1px",
                      py: 1,
                      px: 2,
                    }}
                  >
                    <Typography variant="h6">
                      {firstLetter(user.username).toUpperCase()}
                    </Typography>
                  </Box>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    button
                    component="a"
                    href={setting.href}
                    key={setting}
                    onClick={handleCloseUserMenu}
                  >
                    {setting.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
