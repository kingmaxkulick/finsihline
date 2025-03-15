/**
 * Side widget that displays isolation resistance values.
 * Self-contained component with its own data processing.
 */

import React from 'react';
import { type ReactElement } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BMS_KEYS } from '../../../constants/can-keys';

interface IsoValuesProps {
  vehicleData: Record<string, number> | undefined;
  isLoading: boolean;
  error: unknown;
  onClick: () => void;
}

const IsoValues = ({ 
  vehicleData, 
  isLoading, 
  error, 
  onClick 
}: IsoValuesProps): ReactElement => {
  // Extract IMD values directly in the component
  const imdResPos = isLoading || error ? 0 : vehicleData?.[BMS_KEYS.IMD_RES_POS] ?? 0;
  const imdResNeg = isLoading || error ? 0 : vehicleData?.[BMS_KEYS.IMD_RES_NEG] ?? 0;
  
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
        ISO VALS
      </Typography>
      <Stack spacing={1}>
        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 1)' }}>
          IMD RES POS: {imdResPos.toFixed(1)}kΩ
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 1)' }}>
          IMD RES NEG: {imdResNeg.toFixed(1)}kΩ
        </Typography>
      </Stack>
    </Paper>
  );
};

export default IsoValues;