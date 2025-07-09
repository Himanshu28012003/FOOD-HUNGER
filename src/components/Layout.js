import React from 'react';
import Container from '@mui/material/Container';
import NavigationBar from './NavigationBar';

function Layout({ children, isLoggedIn, onLogout }) {
  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
}

export default Layout; 