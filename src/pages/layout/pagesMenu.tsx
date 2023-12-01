import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";
import { NavButton } from "./navButton";
import { HOME, LOGIN_PATH, PROBLEM_PATH, REGISTER_PATH, SEARCH_PATH, SIGNUP_PATH, USER_NAME } from "../../util/constants";

const pages = [
  { label: 'problems', path: `${PROBLEM_PATH}` },
  { label: 'search', path: `${SEARCH_PATH}` },
  { label: 'create', path: `${REGISTER_PATH}` },
  { label: 'sign-up', path: `${SIGNUP_PATH}` },
  { label: 'log-in', path: `${LOGIN_PATH}` },
]

export function PagesMenu() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href={HOME}
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontWeight: 700,
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        GO-PROBLEM
      </Typography>

      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current use r"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem key={page.label} onClick={() => {
              navigate(`/${page.path}`)
              handleCloseNavMenu()
            }}>
              <Typography textAlign="center">{page.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: 'flex', md: 'none' },
          flexGrow: 1,
          fontWeight: 700,
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        GO-PROBLEM
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => (
          <NavButton
            key={page.label}
            onClick={() => navigate(`/${page.path}`)}
          >
            {page.label}
          </NavButton>
        ))}
      </Box>
    </>
  )
}
