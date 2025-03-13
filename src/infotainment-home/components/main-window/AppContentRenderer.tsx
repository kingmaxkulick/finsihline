/**
 * Renders the appropriate content based on the selected app.
 * Music case added, Controls is now directly accessible from bottom nav.
 */

import React from 'react';
import { Box } from '@mui/material';
import ControlsApp from '../ControlsApp/ControlsApp';
import PlotView from '../PlotView-app/PlotView';

interface ChargingStatus {
  isCharging: boolean;
  batteryLevel: number;
  timeRemaining: number;
  chargingPower: number;
  voltage: number;
  current: number;
}

// Placeholder for the ChargingScreen component
const ChargingScreen = ({ status }: { status: ChargingStatus }) => (
  <Box sx={{ p: 3 }}>Charging Screen (Battery: {status.batteryLevel}%)</Box>
);

// Placeholder for Music app
const MusicApp = () => (
  <Box sx={{ p: 3, height: '100%' }}>
    <h2>Music Player</h2>
    <p>Music player interface would go here.</p>
  </Box>
);

interface AppContentRendererProps {
  appName: string | null;
  chargingStatus: ChargingStatus;
}

const AppContentRenderer = ({ appName, chargingStatus }: AppContentRendererProps): JSX.Element => {
  switch (appName) {
    case 'Profile':
      return <Box sx={{ p: 3 }}>Profile Details View</Box>;
    case 'Range':
      return <Box sx={{ p: 3 }}>Range Information View</Box>;
    case 'Charging':
      return <ChargingScreen status={chargingStatus} />;
    case 'Plot View':
      return <PlotView />;
    case 'Radio':
      return <Box sx={{ p: 3 }}>Radio View</Box>;
    case 'Dev':
      return <ControlsApp />;
    case 'Music': // Added Music case
      return <MusicApp />;
    default:
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            typography: 'h6',
            color: 'text.secondary'
          }}
        >
          {appName ? `${appName} View` : 'No app selected'}
        </Box>
      );
  }
};

export default AppContentRenderer;