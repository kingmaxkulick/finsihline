/**

Main layout component for the infotainment dashboard.
Orchestrates the entire UI including splash screen, status bar, navigation,
app content, climate controls, and warning overlays.

*/

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import StatusBar from '../TopBar/TopBar';
import AppContainer from '../MainWindow/Content/AppContainer';
import ClimateControl from '../NavBar/ClimateControl';
import BottomNav from '../NavBar/BottomNav';
import InfoSidebar from '../SideWidgets/InfoSidebar';
import AppContentRenderer from '../MainWindow/Content/AppContentRenderer';
import SplashScreen from '../SplashScreen/splash-screen';
import IMDFaultWarning from '../IMDFaultWarning';
import { useVehicleData } from '../../hooks/vehicle-hooks';
import { useAppState } from '../../hooks/use-app-state';
import { dashboardTheme } from '../../theme/theme';
import backgroundImage from '../../../assets/BRELLE - OSL FLAT BODY 2.6507.png';
import startupVideo from '../../../assets/Comp 3.MOV';

const DashboardLayout = (): JSX.Element => {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  
  // Fetch vehicle data from backend
  const { data, isLoading, error } = useVehicleData();
  
  // App state management
  const {
    appState,
    handleAppSelect,
    handleCloseApp,
    handleCloseClimate,
    handleInfoBoxClick,
    showMainContent
  } = useAppState();

  // Function to handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          videoSrc={startupVideo}
          onComplete={handleSplashComplete}
          skipDuration={10000}
        />
      )}

      {/* IMD Fault Warning - add this line to show the warning */}
      <IMDFaultWarning fullScreenOverlay={false} />

      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Status Bar */}
        <StatusBar time="12:00 PM" temperature="72°F" />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%'
          }}
        >
          {/* Background Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.4)'
            }}
          />

          {/* Info Boxes */}
          <InfoSidebar
            vehicleData={data}
            isLoading={isLoading}
            error={error}
            onBoxClick={handleInfoBoxClick}
            zIndex={showMainContent ? 0 : 1}
          />

          {/* Main App Content */}
          <AppContainer isOpen={showMainContent} onClose={handleCloseApp}>
            <AppContentRenderer 
              appName={appState.name} 
              chargingStatus={appState.chargingStatus} 
            />
          </AppContainer>

          {/* Climate Control Overlay */}
          <ClimateControl open={appState.isClimateOpen} onClose={handleCloseClimate} />
        </Box>

        {/* Bottom Navigation */}
        <BottomNav
          activeApp={appState.isClimateOpen ? 'Climate' : appState.name}
          onAppSelect={handleAppSelect}
          chargingStatus={appState.chargingStatus}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;