// src/infotainment-home/components/main-window/warnings/IMDFaultWarning.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useVehicleData } from '../hooks/vehicle-hooks';
import { BMS_KEYS, isExceedingThreshold } from '../constants/can-keys';

interface IMDFaultWarningProps {
  fullScreenOverlay?: boolean; // Keep the prop for compatibility
}

/**
 * IMD Fault Warning component that shows a centered, vertically long warning 
 * when IMD values are out of threshold.
 */
const IMDFaultWarning: React.FC<IMDFaultWarningProps> = ({ 
  fullScreenOverlay = false // Keep the prop for compatibility but we don't use it anymore
}) => {
  const { data, isLoading, error } = useVehicleData();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(true);

  // Check if either IMD value is outside threshold
  useEffect(() => {
    if (isLoading || error || !data) return;

    const imdResPos = data[BMS_KEYS.IMD_RES_POS];
    const imdResNeg = data[BMS_KEYS.IMD_RES_NEG];
    
    const isPosOutOfThreshold = imdResPos !== undefined && isExceedingThreshold(BMS_KEYS.IMD_RES_POS, imdResPos);
    const isNegOutOfThreshold = imdResNeg !== undefined && isExceedingThreshold(BMS_KEYS.IMD_RES_NEG, imdResNeg);
    
    // Show warning if either value is out of threshold
    setShowWarning(isPosOutOfThreshold || isNegOutOfThreshold);
  }, [data, isLoading, error]);

  // Flash effect
  useEffect(() => {
    if (!showWarning) return;
    
    // Flash the warning on/off
    const flashInterval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 500); // Toggle every 500ms
    
    return () => clearInterval(flashInterval);
  }, [showWarning]);

  if (!showWarning) return null;
  
  // Center-screen banner version that's 5x taller (ignoring fullScreenOverlay prop)
  return (
    <Fade in={isFlashing}>
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: '50%',  // Center vertically
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
          zIndex: 9999,
          width: '90%',
          maxWidth: '800px',
          // Make it 5x taller but keep same width
          height: '250px', // Increased height (standard would be ~50px)
          bgcolor: '#ff0000',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: 2
        }}>
          <AlertTriangle size={48} color="white" />
          <Typography 
            variant="h4" 
            sx={{ 
              mt: 2, 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '2.5rem',
              textAlign: 'center'
            }}
          >
            IMD FAULT
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default IMDFaultWarning;