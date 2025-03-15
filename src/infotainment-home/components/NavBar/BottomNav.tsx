// src/infotainment-home/components/NavBar/BottomNav.tsx
import React, { useState } from 'react';
import { type ReactElement } from 'react';
import { Paper, Box } from '@mui/material';
import AppDrawer from './AppDrawer';
import PrimaryApps from './PrimaryApps';
import ContextualApps from './ContexualApps';
import { primaryApps, secondaryApps } from '@/config/navigation'
import { useContextualApps } from '../../hooks/useContexualApps'

interface BottomNavProps {
  activeApp: string | null;
  onAppSelect: (app: string | null) => void;
  chargingStatus?: any;
}

const BottomNav = ({ 
  activeApp, 
  onAppSelect, 
  chargingStatus 
}: BottomNavProps): ReactElement => {
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const contextualApps = useContextualApps();

  const handleAppClick = (appLabel: string): void => {
    if (appLabel === 'Apps') {
      setIsAppDrawerOpen(true);
      return;
    }

    // If clicking the active app, close it by setting activeApp to null
    if (appLabel === activeApp) {
      onAppSelect(null);
    } else {
      onAppSelect(appLabel);
    }
  };

  // Handler for app drawer selection
  const handleAppDrawerSelect = (label: string): void => {
    handleAppClick(label);
    setIsAppDrawerOpen(false);
  };
  
  // Convert secondaryApps to the format AppDrawer expects with explicit type assertion
  const appDrawerApps = secondaryApps.map(app => ({
    icon: app.icon as JSX.Element, // Explicitly assert the icon is a JSX.Element
    label: app.label
  }));

  return (
    <>
      <Paper
        square
        elevation={0}
        sx={{
          bgcolor: 'rgba(220, 220, 225, 0.8)',
          borderTop: 1,
          borderColor: 'divider',
          py: 0.5,
          px: 2,
          height: '50px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Left vertical divider */}
          <Box sx={{ 
            position: 'absolute', 
            left: '33%', 
            top: '15%', 
            height: '70%', 
            width: '1px', 
            backgroundColor: 'text.secondary' 
          }} />
          
          {/* Right vertical divider */}
          <Box sx={{ 
            position: 'absolute', 
            right: '33%', 
            top: '15%', 
            height: '70%', 
            width: '1px', 
            backgroundColor: 'text.secondary' 
          }} />
          
          {/* Contextual apps based on vehicle state */}
          <ContextualApps 
            apps={contextualApps} 
            activeApp={activeApp} 
            onAppSelect={handleAppClick} 
          />
          
          {/* Primary navigation apps */}
          <PrimaryApps 
            apps={primaryApps} 
            activeApp={activeApp} 
            onAppSelect={handleAppClick} 
          />
        </Box>
      </Paper>

      <AppDrawer
        open={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        apps={appDrawerApps}
        onAppSelect={handleAppDrawerSelect}
        activeApp={activeApp}
      />
    </>
  );
};

export default BottomNav;