// src/infotainment-home/components/Controls-app/ControlsApp.tsx
import React from 'react';
import { Box } from '@mui/material';

// Import the tech specs main window directly
import TechSpecsMainWindow from './ControlsAppContent/ControlsAppMainWindow';

/**
 * Controls app component that directly renders the TechSpecsMainWindow.
 */
const ControlsApp: React.FC = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <TechSpecsMainWindow />
    </Box>
  );
};

export default ControlsApp;