/**
 * Side widget that displays current vehicle pack voltage.
 * Handles its own data processing and formatting.
 */

import { type ReactElement } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { INVERTER_KEYS } from '../../../constants/can-keys';

interface PackVoltageProps {
  vehicleData: Record<string, number> | undefined;
  isLoading: boolean;
  error: unknown;
  onClick: () => void;
}

const PackVoltage = ({ 
  vehicleData, 
  isLoading, 
  error, 
  onClick 
}: PackVoltageProps): ReactElement => {
  // Calculate pack voltage from multiple potential sources
  let voltage = 0;
  if (!isLoading && !error && vehicleData) {
    // Try DC Bus Voltage first (from Inverter)
    voltage = vehicleData[INVERTER_KEYS.DC_BUS_VOLTAGE] ?? 0;
    
    // If that's 0, try the synthesized voltage
    if (voltage === 0) {
      voltage = vehicleData['BMS_TX_STATE_5.Volt_Synth_x10_V'] ?? 0;
    }
    
    // If still 0, try Volt_1
    if (voltage === 0) {
      voltage = vehicleData['BMS_TX_STATE_5.Volt_1_x10_V'] ?? 0;
    }
  }

  // Format the voltage to 1 decimal place
  const formattedVoltage = voltage.toFixed(1);
  
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        bgcolor: 'rgba(220, 220, 225, 0.8)',
        borderRadius: 1,
        p: 1.5,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(0, 0, 0, 1)',
          mb: 1
        }}
      >
        PACK VOLTAGE
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 1)' }}>
        {formattedVoltage} V
      </Typography>
    </Paper>
  );
};

export default PackVoltage;