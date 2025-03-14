/**

Component that tracks and monitors min/max values of critical vehicle parameters over time.
Displays real-time and historical extremes for cell voltages, temperatures, IMD resistance,
and DC bus current with visual indicators for out-of-range values and integrated logging capability.

*/

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  useTheme,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Zap,
  ZapOff,
  Thermometer,
  Battery,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import SaveIcon from '@mui/icons-material/Save';
import StopIcon from '@mui/icons-material/Stop';
import ListIcon from '@mui/icons-material/List';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useVehicleData } from '@/infotainment-home/hooks/vehicle-hooks';
import { useCanLogger } from '@/infotainment-home/hooks/use-can-logger';
import { BMS_KEYS, INVERTER_KEYS, SIGNAL_GROUPS, isExceedingThreshold } from '@/infotainment-home/constants/can-keys';

/**
 * Component that tracks and displays key min/max values in the system:
 * - Min/Max cell voltages
 * - Min/Max cell temperatures
 * - IMD Resistance (Pos/Neg)
 * - Maximum DC Bus Current (drive)
 * - Minimum DC Bus Current (regen)
 */
interface LogFile {
  filename: string;
  size_bytes: number;
  created: string;
  id: number;
}

const MinMaxValuesView = (): JSX.Element => {
  const theme = useTheme();
  const { data, isLoading, error } = useVehicleData();
  const { 
    isLogging, 
    toggleLogging, 
    currentLogEntries, 
    currentLogId,
    error: loggerError,
    getLogList,
    downloadLog
  } = useCanLogger();
  
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  
  // Current values
  const [minCellVoltage, setMinCellVoltage] = useState<number | null>(null);
  const [maxCellVoltage, setMaxCellVoltage] = useState<number | null>(null);
  const [minCellTemp, setMinCellTemp] = useState<number | null>(null);
  const [maxCellTemp, setMaxCellTemp] = useState<number | null>(null);
  
  // Tracked extrema values
  const [allTimeMinCellVoltage, setAllTimeMinCellVoltage] = useState<number | null>(null);
  const [allTimeMaxCellVoltage, setAllTimeMaxCellVoltage] = useState<number | null>(null);
  const [allTimeMinCellTemp, setAllTimeMinCellTemp] = useState<number | null>(null);
  const [allTimeMaxCellTemp, setAllTimeMaxCellTemp] = useState<number | null>(null);
  
  // IMD Resistance values
  const [imdResPos, setImdResPos] = useState<number | null>(null);
  const [imdResNeg, setImdResNeg] = useState<number | null>(null);
  
  // DC Bus Current (extremes)
  const [maxDcBusCurrent, setMaxDcBusCurrent] = useState<number>(0);
  const [minDcBusCurrent, setMinDcBusCurrent] = useState<number>(0);
  
  // Format a value with the specified precision and suffix
  const formatValue = (value: number | null, precision: number = 1, suffix: string = ''): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(precision)}${suffix}`;
  };
  
  // Update the tracked extremes
  useEffect(() => {
    if (!data || isLoading || error) return;
    
    // Get the current values
    const currentMinCellVoltage = data[BMS_KEYS.CELL_MIN_VOLTAGE] ?? null;
    const currentMaxCellVoltage = data[BMS_KEYS.CELL_MAX_VOLTAGE] ?? null;
    const currentMinCellTemp = data[BMS_KEYS.CELL_TEMP_MIN] ?? null;
    const currentMaxCellTemp = data[BMS_KEYS.CELL_TEMP_MAX] ?? null;
    
    // Update current values
    setMinCellVoltage(currentMinCellVoltage);
    setMaxCellVoltage(currentMaxCellVoltage);
    setMinCellTemp(currentMinCellTemp);
    setMaxCellTemp(currentMaxCellTemp);
    
    // Track all-time minimum cell voltage (lowest value seen)
    if (currentMinCellVoltage !== null && (allTimeMinCellVoltage === null || currentMinCellVoltage < allTimeMinCellVoltage)) {
      setAllTimeMinCellVoltage(currentMinCellVoltage);
    }
    
    // Track all-time maximum cell voltage (highest value seen)
    if (currentMaxCellVoltage !== null && (allTimeMaxCellVoltage === null || currentMaxCellVoltage > allTimeMaxCellVoltage)) {
      setAllTimeMaxCellVoltage(currentMaxCellVoltage);
    }
    
    // Track all-time minimum cell temperature (lowest value seen)
    if (currentMinCellTemp !== null && (allTimeMinCellTemp === null || currentMinCellTemp < allTimeMinCellTemp)) {
      setAllTimeMinCellTemp(currentMinCellTemp);
    }
    
    // Track all-time maximum cell temperature (highest value seen)
    if (currentMaxCellTemp !== null && (allTimeMaxCellTemp === null || currentMaxCellTemp > allTimeMaxCellTemp)) {
      setAllTimeMaxCellTemp(currentMaxCellTemp);
    }
    
    // Get the current DC bus current
    const dcBusCurrent = data[INVERTER_KEYS.DC_BUS_CURRENT];
    
    if (typeof dcBusCurrent === 'number') {
      // Update maximum (positive) current for drive
      if (dcBusCurrent > 0 && dcBusCurrent > maxDcBusCurrent) {
        setMaxDcBusCurrent(dcBusCurrent);
      }
      
      // Update minimum (negative) current for regen
      if (dcBusCurrent < 0 && dcBusCurrent < minDcBusCurrent) {
        setMinDcBusCurrent(dcBusCurrent);
      }
    }
    
    // Update IMD resistance values
    setImdResPos(data[BMS_KEYS.IMD_RES_POS] ?? null);
    setImdResNeg(data[BMS_KEYS.IMD_RES_NEG] ?? null);
    
  }, [data, isLoading, error, allTimeMinCellVoltage, allTimeMaxCellVoltage, allTimeMinCellTemp, allTimeMaxCellTemp]);
  
  // Reset observed extremes
  const handleReset = useCallback(() => {
    setMaxDcBusCurrent(0);
    setMinDcBusCurrent(0);
    setAllTimeMinCellVoltage(null);
    setAllTimeMaxCellVoltage(null);
    setAllTimeMinCellTemp(null);
    setAllTimeMaxCellTemp(null);
  }, []);
  
  // Show error in snackbar if logger has an error
  useEffect(() => {
    if (loggerError) {
      setSnackbarMessage(loggerError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [loggerError]);
  
  // Fetch the list of log files
  const fetchLogFiles = async () => {
    const files = await getLogList();
    setLogFiles(files);
  };
  
  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
    fetchLogFiles();
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle log file download
  const handleDownloadLog = (logId: number) => {
    downloadLog(logId);
    handleMenuClose();
    setSnackbarMessage(`Downloading log file keymetrics-${logId}.csv`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Handle logger toggle with feedback
  const handleToggleLogger = async () => {
    if (isLogging) {
      await toggleLogging();
      setSnackbarMessage(`Stopped logging. Saved file keymetrics-${currentLogId}.csv`);
      setSnackbarSeverity('success');
    } else {
      // Get the keys we want to log - focus on the relevant signals for this view
      const keysToLog: string[] = [
        // Cell voltages
        BMS_KEYS.CELL_MIN_VOLTAGE,
        BMS_KEYS.CELL_MAX_VOLTAGE,
        
        // Cell temperatures
        BMS_KEYS.CELL_TEMP_MIN,
        BMS_KEYS.CELL_TEMP_MAX,
        
        // IMD Resistance values
        BMS_KEYS.IMD_RES_POS,
        BMS_KEYS.IMD_RES_NEG,
        
        // DC Bus Current
        INVERTER_KEYS.DC_BUS_CURRENT,
        
        // Include all battery metrics
        ...SIGNAL_GROUPS.BATTERY,
        
        // Include all temperature metrics
        ...SIGNAL_GROUPS.TEMPERATURE,
        
        // Include all isolation metrics
        ...SIGNAL_GROUPS.ISOLATION
      ];
      
      // Remove duplicates
      const uniqueKeysToLog = [...new Set(keysToLog)];
      
      await toggleLogging(uniqueKeysToLog);
      setSnackbarMessage(`Started logging ${uniqueKeysToLog.length} signals with ID ${currentLogId + 1}`);
      setSnackbarSeverity('info');
    }
    setSnackbarOpen(true);
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 }, 
      pt: { xs: 3, sm: 4 },
      height: 'calc(100% - 80px)',
      overflow: 'auto',
      // Add substantial bottom padding - key to fixing scrolling issues
      pb: 80,
      marginBottom: 16,
      // Hide scrollbar while maintaining scroll functionality
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {  // Chrome, Safari, Edge
        display: 'none'
      },
      msOverflowStyle: 'none', // IE and Edge
    }}>
      {/* Header with title and controls */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 2,
        // Micro-adjustment to padding (barely perceptible)
        pt: { xs: 3.01, sm: 3.02 }
      }}>
        <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Min/Max Value Tracker
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={isLogging ? `Currently logging (${currentLogEntries} entries)` : "Start logging extremes data"}>
            <Button
              variant="contained"
              color={isLogging ? "error" : "primary"}
              onClick={handleToggleLogger}
              startIcon={isLogging ? <StopIcon /> : <SaveIcon />}
              size="small"
              sx={{
                transition: 'all 0.3s',
                position: 'relative',
                minWidth: { xs: '120px', sm: '160px' },
                mr: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {isLogging ? (
                <>
                  Stop Logging 
                  <Box component="span" sx={{ ml: 1, fontSize: '0.7rem', opacity: 0.8 }}>
                    ({currentLogEntries})
                  </Box>
                </>
              ) : (
                "Start Logging"
              )}
              
              {isLogging && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 8,
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      mr: 1,
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                </Box>
              )}
            </Button>
          </Tooltip>
          
          {/* Menu for log files */}
          <Tooltip title="Log files">
            <IconButton
              color="primary"
              onClick={handleMenuOpen}
              size="small"
              sx={{ 
                bgcolor: theme.palette.background.paper,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Log files menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            maxHeight: 300,
            width: 300
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontSize: '0.75rem' }}>
          Available Log Files
        </Typography>
        
        {logFiles.length === 0 && (
          <MenuItem disabled>
            <ListItemText 
              primary="No log files available" 
              primaryTypographyProps={{ fontSize: '0.75rem' }}
            />
          </MenuItem>
        )}
        
        {logFiles.map((file) => (
          <MenuItem key={file.id} onClick={() => handleDownloadLog(file.id)}>
            <ListItemIcon>
              <FileDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={file.filename} 
              secondary={`${formatFileSize(file.size_bytes)} • ${new Date(file.created).toLocaleString()}`}
              primaryTypographyProps={{ fontSize: '0.75rem' }}
              secondaryTypographyProps={{ fontSize: '0.7rem' }}
            />
          </MenuItem>
        ))}
      </Menu>
      
      <Grid container spacing={2}>
        {/* Battery Voltage Section */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Battery size={16} />
              <Typography variant="subtitle1" sx={{ ml: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Cell Voltage Extremes
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    Min Cell Voltage
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(allTimeMinCellVoltage, 3, ' V')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Real time: {formatValue(minCellVoltage, 3, ' V')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    Max Cell Voltage
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(allTimeMaxCellVoltage, 3, ' V')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Real time: {formatValue(maxCellVoltage, 3, ' V')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* Battery Temperature Section */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Thermometer size={16} />
              <Typography variant="subtitle1" sx={{ ml: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Cell Temperature Extremes
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    Min Cell Temp
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(allTimeMinCellTemp, 1, ' °C')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Real time: {formatValue(minCellTemp, 1, ' °C')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    Max Cell Temp
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(allTimeMaxCellTemp, 1, ' °C')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Real time: {formatValue(maxCellTemp, 1, ' °C')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* IMD Resistance Values */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ZapOff size={16} />
              <Typography variant="subtitle1" sx={{ ml: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                IMD Resistance Values
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    IMD Res Pos
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      color: imdResPos !== null && isExceedingThreshold(BMS_KEYS.IMD_RES_POS, imdResPos) 
                        ? 'error.main' 
                        : 'text.primary'
                    }}
                  >
                    {formatValue(imdResPos, 1, ' kΩ')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
                    IMD Res Neg
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      color: imdResNeg !== null && isExceedingThreshold(BMS_KEYS.IMD_RES_NEG, imdResNeg) 
                        ? 'error.main' 
                        : 'text.primary'
                    }}
                  >
                    {formatValue(imdResNeg, 1, ' kΩ')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* DC Bus Current Extremes */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Zap size={16} />
              <Typography variant="subtitle1" sx={{ ml: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                DC Bus Current Tracking
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TrendingUp size={14} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                      Max Drive Current
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(maxDcBusCurrent, 1, ' A')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    borderLeft: '4px solid #1976d2'  
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TrendingDown size={14} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                      Max Regen Current
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {formatValue(minDcBusCurrent, 1, ' A')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%', fontSize: '0.75rem' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MinMaxValuesView;