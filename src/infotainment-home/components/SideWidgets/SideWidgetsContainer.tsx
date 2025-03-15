/**
 * Container component that positions the side widgets on the dashboard.
 * Handles layout and positioning without managing widget-specific data.
 */

import React from 'react';
import { Box, Stack } from '@mui/material';

interface SideWidgetsContainerProps {
  children: React.ReactNode;
  zIndex: number;
}

const SideWidgetsContainer = ({ 
  children, 
  zIndex 
}: SideWidgetsContainerProps): JSX.Element => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '200px',
        zIndex
      }}
    >
      <Stack spacing={2}>
        {children}
      </Stack>
    </Box>
  );
};

export default SideWidgetsContainer;