import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { getFlightsHasSearched } from '../store/selectors/flightSelectors';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  AirplanemodeActive,
  Person,
  AccountCircle,
  ExitToApp,
  BookmarkBorder,
  Help,
  ArrowBack,
} from '@mui/icons-material';
import { GradientButton } from './ui/GradientButton';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const hasSearched = useSelector(getFlightsHasSearched);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleClose();
    navigate('/');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  const handleHomeClick = () => {
    // If we're already on home page, don't navigate
    if (location.pathname === '/') {
      return;
    }
    // Navigate to home without clearing state
    navigate('/');
  };

  const handleSearchFlightsClick = () => {
    // Always go to home for search
    navigate('/');
  };

  const handleSignInClick = () => {
    navigate('/login', {
      state: {
        from: location,
        hasSearchResults: hasSearched,
      },
    });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{ px: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center' }}
      >
        {/* Conditional Back Button */}
        {location.pathname !== '/' && (
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              color: '#64748B',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(100, 116, 139, 0.1)',
              },
            }}
          >
            Back
          </Button>
        )}

        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            flexGrow: 0,
          }}
          onClick={handleHomeClick}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #7DD3FC, #38BDF8)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AirplanemodeActive sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1E293B',
              fontSize: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            SkyBook
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mx: 6 }}>
          <Button
            sx={{
              color: location.pathname === '/' ? '#3B82F6' : '#64748B',
              fontWeight: location.pathname === '/' ? 600 : 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F1F5F9',
                color: '#1E293B',
              },
            }}
            onClick={handleSearchFlightsClick}
          >
            Search Flights
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/bookings"
            sx={{
              fontWeight: location.pathname === '/bookings' ? 600 : 400,
              color:
                location.pathname === '/bookings'
                  ? '#3B82F6'
                  : '#64748B',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F1F5F9',
                color: '#1E293B',
              },
            }}
          >
            My Bookings
          </Button>
          <Button
            sx={{
              color: '#64748B',
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F1F5F9',
                color: '#1E293B',
              },
            }}
          >
            Deals
          </Button>
          <Button
            sx={{
              color: '#64748B',
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              borderRadius: '6px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F1F5F9',
                color: '#1E293B',
              },
            }}
          >
            Help
          </Button>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* User Actions */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                p: 0,
                '&:hover': {
                  bgcolor: 'transparent',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#3B82F6',
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  mt: 1,
                  minWidth: 200,
                },
              }}
            >
              <Box sx={{ px: 3, py: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: '#1E293B' }}
                >
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Manage your account
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => handleMenuItemClick('/bookings')}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    bgcolor: '#F1F5F9',
                  },
                }}
              >
                <BookmarkBorder
                  sx={{ mr: 2, fontSize: 20, color: '#64748B' }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: '#1E293B' }}
                >
                  My Bookings
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    bgcolor: '#FEF2F2',
                  },
                }}
              >
                <ExitToApp sx={{ mr: 2, fontSize: 20, color: '#DC2626' }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: '#DC2626' }}
                >
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              sx={{
                color: '#64748B',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                borderRadius: '6px',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  color: '#1E293B',
                },
              }}
              onClick={handleSignInClick}
            >
              Sign In
            </Button>
            <GradientButton
              onClick={() => navigate('/register')}
              sx={{
                height: '44px',
                px: 3,
                fontSize: '0.875rem',
              }}
            >
              Sign Up
            </GradientButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
