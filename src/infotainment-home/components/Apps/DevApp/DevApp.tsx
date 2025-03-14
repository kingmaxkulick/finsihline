/**

Container component that hosts the Developer Tools application.
Provides a wrapper with full-height layout for the DevAppMainWindow component.

*/

import React from 'react';
import { Box } from '@mui/material';

// Import the tech specs main window directly
import DevAppMainWindow from './DevAppContent/DevAppMainWindow';

const DevApp: React.FC = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <DevAppMainWindow />
    </Box>
  );
};

export default DevApp;