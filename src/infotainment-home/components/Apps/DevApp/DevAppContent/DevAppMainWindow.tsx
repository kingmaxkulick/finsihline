/**

Main navigation component for the Developer Tools section that provides access
to various technical data screens.

*/

import React, { useState } from 'react';
import { Box, Typography, Button, Grid, IconButton, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BatteryTempMonitor from './BatteryTempMonitor';
import KeyMetricsView from './KeyMetricsView';
import MinMaxValuesView from './MinMaxValuesView';

type TechView = 'main' | 'batteryTemp' | 'keyMetrics' | 'minMaxValues';

const DevAppMainWindow = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<TechView>('main');

  const navigateTo = (view: TechView) => {
    setCurrentView(view);
  };

  // Main tech specs dashboard with buttons to various detailed views
  const renderMainView = () => (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Technical Data
      </Typography>
      
      <Grid container spacing={2}>
        {/* Key Metrics button with elegant styling */}
        <Grid item xs={6} sm={3} md={2}>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.85),
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.95),
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
              }
            }}
            onClick={() => navigateTo('keyMetrics')}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              KEY SIGNALS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saftey critical
            </Typography>
          </Button>
        </Grid>
        
        {/* Cell Temps button with elegant styling */}
        <Grid item xs={6} sm={3} md={2}>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: theme => alpha(theme.palette.secondary.main, 0.85),
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.secondary.main, 0.95),
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
              }
            }}
            onClick={() => navigateTo('batteryTemp')}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cell Temps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              module data
            </Typography>
          </Button>
        </Grid>

        {/* Min/Max Values button with elegant styling */}
        <Grid item xs={6} sm={3} md={2}>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: theme => `linear-gradient(45deg, ${alpha(theme.palette.info.dark, 0.85)} 30%, ${alpha(theme.palette.info.main, 0.85)} 90%)`,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme => `linear-gradient(45deg, ${alpha(theme.palette.info.dark, 0.95)} 30%, ${alpha(theme.palette.info.main, 0.95)} 90%)`,
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
              }
            }}
            onClick={() => navigateTo('minMaxValues')}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Min/Max Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current & Voltage Extremes
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  // Conditional rendering based on current view
  return (
    <Box sx={{ height: '100%' }}>
      {currentView === 'main' ? (
        renderMainView()
      ) : (
        <Box sx={{ height: '100%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 6, left: 16, zIndex: 10 }}>
            <IconButton 
              onClick={() => navigateTo('main')}
              sx={{ 
                bgcolor: 'background.paper', 
                '&:hover': { bgcolor: 'action.hover' } 
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          
          {currentView === 'batteryTemp' && <BatteryTempMonitor />}
          {currentView === 'keyMetrics' && <KeyMetricsView />}
          {currentView === 'minMaxValues' && <MinMaxValuesView />}
        </Box>
      )}
    </Box>
  );
};

export default DevAppMainWindow;