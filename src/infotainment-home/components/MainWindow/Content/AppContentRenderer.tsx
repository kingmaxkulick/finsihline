/** 
 * AppContentRenderer Component
 *
 * Responsible for rendering the appropriate infotainment application view 
 * based on the selected app name. This component acts as a router for 
 * different app screens within the infotainment system.
 *
 * Props:
 * - `appName` (string | null): The currently selected app name.
 * - `chargingStatus` (ChargingStatus): An object containing charging-related data.
 *
 * Behavior:
 * - Switches between different infotainment views (e.g., Navigation, Music, Climate).
 * - Displays placeholder views for apps that are not yet implemented.
 * - Shows a fallback message when no app is selected.
 *
 * Usage:
 * ```tsx
 * <AppContentRenderer appName="Music" chargingStatus={chargingStatus} />
 * ```
 */

import { Box } from '@mui/material';
import DevApp from '../../Apps/DevApp/DevApp';
import PlotView from '../../Apps/PlotViewApp/PlotView';
import ChargingApp from '../../Apps/ChargingApp/ChargingApp';

interface ChargingStatus {
  isCharging: boolean;
  batteryLevel: number;
  timeRemaining: number;
  chargingPower: number;
  voltage: number;
  current: number;
}

interface AppContentRendererProps {
  appName: string | null;
  chargingStatus: ChargingStatus;
}

const AppContentRenderer = ({ appName, chargingStatus }: AppContentRendererProps): JSX.Element => {
  switch (appName) {
    // Primary apps from navbar
    case 'Navigation':
      return <Box sx={{ p: 3 }}>Navigation View</Box>;
    case 'Dev':
      return <DevApp />;
    case 'Climate':
      return <Box sx={{ p: 3 }}>Climate Control View</Box>;
    
    // Contextual apps
    case 'Charging':
      return <ChargingApp />;
      
    // Secondary apps from navbar
    case 'Music':
      return <Box sx={{ p: 3 }}>Music Player View</Box>;
    case 'Phone':
      return <Box sx={{ p: 3 }}>Phone View</Box>;
    case 'Radio':
      return <Box sx={{ p: 3 }}>Radio View</Box>;
    case 'Plot View':
      return <PlotView />;
    case 'Calendar':
      return <Box sx={{ p: 3 }}>Calendar View</Box>;
    case 'Camera':
      return <Box sx={{ p: 3 }}>Camera View</Box>;
    case 'Settings':
      return <Box sx={{ p: 3 }}>Settings View</Box>;
      
    // Side widget views
    case 'Profile':
      return <Box sx={{ p: 3 }}>DRIVER PROFILE Details View</Box>;
    case 'Voltage':
      return <Box sx={{ p: 3 }}>PACK VOLTAGE Information View</Box>;
    case 'Technical':
      return <Box sx={{ p: 3 }}>ISO VALS Information View</Box>;
      
    // Default case
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