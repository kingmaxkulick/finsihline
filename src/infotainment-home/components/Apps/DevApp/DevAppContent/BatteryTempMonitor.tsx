/**

Battery temperature monitoring component that displays temperature data for up to 15 battery modules.
Shows min/max/average temperatures in an overview panel and detailed temperature extremes for each module.

*/


import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { useVehicleData } from '@/infotainment-home/hooks/vehicle-hooks';

// Generate keys for CMD1 through CMD15
const generateCellTempKeys = () => {
  const cmdKeys: Record<string, Record<string, string>> = {};
  
  for (let i = 1; i <= 15; i++) {
    cmdKeys[`CMD${i}`] = {
      TEMP1: `BMS_TX_CMD_${i}.CellTemp1`,
      TEMP2: `BMS_TX_CMD_${i}.CellTemp2`,
      TEMP3: `BMS_TX_CMD_${i}.CellTemp3`,
      TEMP4: `BMS_TX_CMD_${i}.CellTemp4`
    };
  }
  
  return cmdKeys;
};

const CELL_TEMP_KEYS = generateCellTempKeys();

const BatteryTempMonitor = (): JSX.Element => {
  const { data, isLoading, error } = useVehicleData();

  // Helper function to get min/max temperature for a command
  const getMinMaxTemp = (cmdKeys: Record<string, string>) => {
    if (isLoading || error || !data) {
      return { min: "N/A", max: "N/A", minCell: "", maxCell: "" };
    }
    
    const temps = Object.entries(cmdKeys).map(([key, value]) => ({
      cell: key,
      key: value,
      temp: data[value]
    })).filter(item => item.temp !== undefined);
    
    if (temps.length === 0) {
      return { min: "N/A", max: "N/A", minCell: "", maxCell: "" };
    }
    
    const minTemp = temps.reduce((prev, curr) => prev.temp < curr.temp ? prev : curr);
    const maxTemp = temps.reduce((prev, curr) => prev.temp > curr.temp ? prev : curr);
    
    return {
      min: minTemp.temp.toFixed(1) + "°C",
      max: maxTemp.temp.toFixed(1) + "°C",
      minCell: minTemp.cell.replace('TEMP', ''),
      maxCell: maxTemp.cell.replace('TEMP', '')
    };
  };

  // Get min/max for each command
  const commandMinMaxTemps = Object.entries(CELL_TEMP_KEYS).map(([cmdName, keys]) => ({
    cmdName,
    ...getMinMaxTemp(keys)
  }));

  return (
    <Box sx={{ 
      p: 3, 
      pt: 6, 
      pb: 12, 
      height: '100%', 
      overflow: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { 
        display: 'none'
      },
      msOverflowStyle: 'none',
    }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Battery Cell Temperatures
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Typography color="info.main" variant="h4" sx={{ fontWeight: 500 }}>
              {data?.["BMS_TX_STATE_7.Cell_Temp_Min_degC"]?.toFixed(1) || "N/A"}°
            </Typography>
            <Typography variant="body2" color="text.secondary">Min Temp</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              {data?.["BMS_TX_STATE_7.Cell_Temp_Avg_degC"]?.toFixed(1) || "N/A"}°
            </Typography>
            <Typography variant="body2" color="text.secondary">Avg Temp</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color="error.main" variant="h4" sx={{ fontWeight: 500 }}>
              {data?.["BMS_TX_STATE_7.Cell_Temp_Max_degC"]?.toFixed(1) || "N/A"}°
            </Typography>
            <Typography variant="body2" color="text.secondary">Max Temp</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>Module Details</Typography>
      <Grid container spacing={2} sx={{ mb: 8 }}>
        {commandMinMaxTemps.map((cmd, index) => (
          <Grid item xs={4} sm={3} md={2} key={cmd.cmdName}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1,
                borderTop: theme => `3px solid ${
                  index % 3 === 0 
                    ? theme.palette.primary.main 
                    : index % 3 === 1 
                      ? theme.palette.secondary.main 
                      : theme.palette.info.main
                }`
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Module {cmd.cmdName.replace('CMD', '')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">High</Typography>
                  <Typography color="error.main">
                    {cmd.max} (Cell {cmd.maxCell})
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Low</Typography>
                  <Typography color="info.main">
                    {cmd.min} (Cell {cmd.minCell})
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ height: 40 }} />
    </Box>
  );
};

export default BatteryTempMonitor;