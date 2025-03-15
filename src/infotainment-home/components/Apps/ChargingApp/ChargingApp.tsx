// src/infotainment-home/components/Apps/ChargingApp/ChargingApp.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useTheme
} from '@mui/material';
import { BatteryCharging, Zap, Thermometer, Battery } from 'lucide-react';
import { useVehicleData } from '../../../hooks/vehicle-hooks';
import { BMS_KEYS } from '../../../constants/can-keys';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Define the voltage data point structure
interface VoltageDataPoint {
  time: number; // seconds since charging started
  voltage: number;
}

const ChargingApp: React.FC = () => {
  const theme = useTheme();
  const { data, isLoading, error } = useVehicleData();
  
  // State for tracking voltage over time
  const [voltageHistory, setVoltageHistory] = useState<VoltageDataPoint[]>([]);
  const [chargingStartTime, setChargingStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDataPoints = 120; // Keep track of 2 minutes worth (1 point per second)
  
  // Get the key metrics data
  const volt1 = data?.[BMS_KEYS.VOLT_1];
  const cellTempMin = data?.[BMS_KEYS.CELL_TEMP_MIN];
  const cellTempMax = data?.[BMS_KEYS.CELL_TEMP_MAX];
  const cellVoltMin = data?.[BMS_KEYS.CELL_MIN_VOLTAGE];
  const cellVoltMax = data?.[BMS_KEYS.CELL_MAX_VOLTAGE];
  
  // Format value with given precision and unit
  const formatValue = (value: any, precision: number = 1, unit: string = ''): string => {
    if (value === undefined || isLoading || error) return 'N/A';
    
    // Handle numbers appropriately
    if (typeof value === 'number') {
      return `${value.toFixed(precision)}${unit}`;
    }
    
    return `${value}${unit}`;
  };
  
  // Initialize charging start time if not set
  useEffect(() => {
    if (chargingStartTime === null) {
      setChargingStartTime(Date.now());
    }
  }, [chargingStartTime]);
  
  // Set up voltage data collection
  useEffect(() => {
    // Start collecting voltage data at 1-second intervals
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        if (volt1 !== undefined && chargingStartTime !== null) {
          const currentTime = Date.now();
          const elapsedSeconds = Math.floor((currentTime - chargingStartTime) / 1000);
          
          setVoltageHistory(prev => {
            // Add the new data point
            const newHistory = [...prev, { time: elapsedSeconds, voltage: volt1 }];
            
            // Keep only the most recent points if we exceed our limit
            if (newHistory.length > maxDataPoints) {
              return newHistory.slice(newHistory.length - maxDataPoints);
            }
            
            return newHistory;
          });
        }
      }, 1000); // Update every second
    }
    
    // Clean up timer
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [volt1, chargingStartTime]);
  
  // Calculate min and max voltage values for chart scaling
  const voltageMin = Math.min(...voltageHistory.map(d => d.voltage), volt1 ?? Infinity) * 0.95;
  const voltageMax = Math.max(...voltageHistory.map(d => d.voltage), volt1 ?? 0) * 1.05;
  
  // Format the time axis tick values (in seconds)
  const formatXAxis = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, bgcolor: 'background.paper', boxShadow: 2 }}>
          <Typography variant="body2">
            Time: {formatXAxis(label)}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            Voltage: {payload[0].value.toFixed(2)}V
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  
  return (
    <Box sx={{ 
      p: 3, 
      pt: 6, 
      height: 'calc(100% - 80px)',
      overflow: 'auto',
      pb: 80, // Add substantial bottom padding
      marginBottom: 16,
      // Hide scrollbar while maintaining scroll functionality
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {  // Chrome, Safari, Edge
        display: 'none'
      },
      msOverflowStyle: 'none', // IE and Edge
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Charging Status
      </Typography>
      
      {/* Voltage Chart */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          height: 300
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Charging Voltage - {formatValue(volt1, 1, 'V')}
        </Typography>
        
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={voltageHistory}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={['dataMin', 'dataMax']} 
              tickFormatter={formatXAxis}
              label={{ value: 'Time since charging started', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              domain={[
                voltageMin < Infinity ? voltageMin : 0, 
                voltageMax > 0 ? voltageMax : 100
              ]}
              label={{
                value: 'Voltage (V)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                offset: 0,
                dy: -5  // Negative value moves it up
              }}
                
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={volt1} stroke={theme.palette.error.main} strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="voltage" 
              stroke={theme.palette.primary.main} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
      
      {/* Detail Metrics */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Battery Details
      </Typography>
      
      <Grid container spacing={2}>
        {/* Cell Temperature - Min */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: theme.palette.info.main
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Thermometer size={20} color={theme.palette.info.main} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Min Cell Temp
              </Typography>
            </Box>
            <Typography variant="h6">
              {formatValue(cellTempMin, 1, '°C')}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Cell Temperature - Max */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: theme.palette.error.main
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Thermometer size={20} color={theme.palette.error.main} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Max Cell Temp
              </Typography>
            </Box>
            <Typography variant="h6">
              {formatValue(cellTempMax, 1, '°C')}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Cell Voltage - Min */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: theme.palette.warning.main
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Battery size={20} color={theme.palette.warning.main} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Min Cell Voltage
              </Typography>
            </Box>
            <Typography variant="h6">
              {formatValue(cellVoltMin, 3, 'V')}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Cell Voltage - Max */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: theme.palette.success.main
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Battery size={20} color={theme.palette.success.main} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Max Cell Voltage
              </Typography>
            </Box>
            <Typography variant="h6">
              {formatValue(cellVoltMax, 3, 'V')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Extra space at bottom to prevent content from being cut off */}
      <Box sx={{ height: 60 }} />
    </Box>
  );
};

export default ChargingApp;