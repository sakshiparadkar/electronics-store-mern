import * as React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        backgroundColor: '#0f172a',
        color: 'white',
        mt: 6,
      }}
    >
      <Typography variant="body2">
        © 2026 SWASTIK ELECTRONICS
      </Typography>
    </Box>
  );
}

export default Footer;
