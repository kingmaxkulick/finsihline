/**
 * Component for displaying statistical information about signal values.
 * Shows min, max, and average values for each selected column.
 */

import React from 'react';
import { Grid, Paper, Typography, Stack, Box } from '@mui/material';
import { ColumnInfo } from '../types';
import { COLORS } from '../utils/constants';

interface SignalStatisticsProps {
  selectedColumns: string[];
  columnInfo: Record<string, ColumnInfo>;
}

const SignalStatistics: React.FC<SignalStatisticsProps> = ({
  selectedColumns,
  columnInfo
}) => {
  if (selectedColumns.length === 0) return null;
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.125rem' }}>
        Signal Statistics
      </Typography>
      <Grid container spacing={2}>
        {selectedColumns.map((column, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={column}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                height: '100%'
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}>
                {column}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem' }}>
                  <span>Min:</span> <strong>{columnInfo[column]?.min.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem' }}>
                  <span>Max:</span> <strong>{columnInfo[column]?.max.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem' }}>
                  <span>Avg:</span> <strong>{columnInfo[column]?.avg.toFixed(2)}</strong>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SignalStatistics;