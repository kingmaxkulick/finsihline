// Updated src/infotainment-home/components/nav-bar/navbar-main.tsx
// Removed text labels from apps

import React from 'react';
import { type ReactElement, useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  Navigation,
  Music2,
  Phone,
  Settings,
  Car,
  Radio,
  Calendar,
  Grid as GridIcon,
  Camera,
  Thermometer,
  BarChart,
  Terminal // Added Terminal icon for Dev
} from 'lucide-react'
import AppDrawer from './navbar-apps'

interface BottomNavProps {
  activeApp: string | null
  onAppSelect: (app: string | null) => void
  chargingStatus?: any
}

// Updated primaryApps array - keeping labels for functionality but not displaying them
const primaryApps = [
  { icon: <Navigation size={22} />, label: 'Navigation' },
  { icon: <Terminal size={22} />, label: 'Dev' },
  { icon: <Thermometer size={22} />, label: 'Climate' },
  { icon: <GridIcon size={22} />, label: 'Apps' }
]

// Secondary apps remain the same
const secondaryApps = [
  { icon: <Music2 size={22} />, label: 'Music' },
  { icon: <Phone size={22} />, label: 'Phone' },
  { icon: <Radio size={22} />, label: 'Radio' },
  { icon: <BarChart size={22} />, label: 'Plot View' },
  { icon: <Calendar size={22} />, label: 'Calendar' },
  { icon: <Camera size={22} />, label: 'Camera' },
  { icon: <Settings size={22} />, label: 'Settings' }
]

const BottomNav = ({ activeApp, onAppSelect, chargingStatus }: BottomNavProps): ReactElement => {
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false)

  const handleAppClick = (appLabel: string): void => {
    if (appLabel === 'Apps') {
      setIsAppDrawerOpen(true)
      return
    }

    // If clicking the active app, close it by setting activeApp to null
    if (appLabel === activeApp) {
      onAppSelect(null)
    } else {
      onAppSelect(appLabel)
    }
  }

  // Handler for app drawer selection that accepts a string only
  const handleAppDrawerSelect = (label: string): void => {
    handleAppClick(label)
    setIsAppDrawerOpen(false)
  }

  return (
    <>
      <Paper
        square
        elevation={0}
        sx={{
          bgcolor: 'rgba(220, 220, 225, 0.8)', // Keeping original background
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
          <Stack
            direction="row"
            spacing={4}
            sx={{
              width: '33.333%',
              justifyContent: 'center'
            }}
          >
            {primaryApps.map((app) => (
              <Paper
                key={app.label}
                elevation={0}
                onClick={() => handleAppClick(app.label)}
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
                  {/* Removed the Box that displays the app label text */}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Paper>

      <AppDrawer
        open={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        apps={secondaryApps}
        onAppSelect={handleAppDrawerSelect}
        activeApp={activeApp}
      />
    </>
  )
}

export default BottomNav