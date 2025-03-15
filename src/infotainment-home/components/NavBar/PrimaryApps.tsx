// src/infotainment-home/components/NavBar/BottomNavigation/PrimaryApps.tsx
import React from 'react';
import { Box, Paper, Stack } from '@mui/material';
import { AppItem } from '@/types/navigation';

interface PrimaryAppsProps {
  apps: AppItem[];
  activeApp: string | null;
  onAppSelect: (app: string) => void;
}

const PrimaryApps: React.FC<PrimaryAppsProps> = ({ 
  apps, 
  activeApp, 
  onAppSelect 
}) => {
  return (
    <Stack
      direction="row"
      spacing={4}
      sx={{
        width: '33.333%',
        justifyContent: 'center'
      }}
    >
      {apps.map((app) => (
        <Paper
          key={app.key}
          elevation={0}
          onClick={() => onAppSelect(app.label)}
          sx={{
            width: '50px',
            p: 0.5,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: activeApp === app.label ? 'primary.main' : 'transparent',
            color: activeApp === app.label ? 'primary.contrastText' : 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            },
            transition: 'background-color 0.2s'
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Box sx={{ color: 'text.secondary' }}>
              {app.icon}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default PrimaryApps;