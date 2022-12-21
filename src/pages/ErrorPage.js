import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";

const primary = purple[500]; // #f44336

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/`);
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        La página que buscas no existe.
      </Typography>
      <Button variant="contained" onClick={handleClick}>Ir al Home</Button>
    </Box>
  );
}