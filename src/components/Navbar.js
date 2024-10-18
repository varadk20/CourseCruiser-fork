// src/components/Navbar.js
import React from 'react';
// import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Course Cruiser
        </Typography>
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
