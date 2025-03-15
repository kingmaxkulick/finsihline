// src/infotainment-home/components/NavBar/BottomNavigation/ContextualApps.tsx
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { AppItem } from '@/types/navigation';

interface ContextualAppsProps {
  apps: AppItem[];
  activeApp: string | null;
  onAppSelect: (app: string) => void;
}

const ContextualApps: React.FC<ContextualAppsProps> = ({ 
  apps, 
  activeApp, 
  onAppSelect 
}) => {
  if (apps.length === 0) return null;
  
  return (
    <>
      {apps.map((app) => (
        <Tooltip key={app.key} title={app.label} placement="top">
          <IconButton
            onClick={() => onAppSelect(app.label)}
            sx={{
              position: 'absolute',
              right: '28%', // Position just outside the right divider
              top: '50%',
              transform: 'translateY(-50%)',
              color: activeApp === app.label ? 'primary.main' : 'text.secondary',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.6 },
                '100%': { opacity: 1 },
              },
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            {app.icon}
          </IconButton>
        </Tooltip>
      ))}
    </>
  );
};

export default ContextualApps;