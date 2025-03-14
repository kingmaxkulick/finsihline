/**
 * Main component for the PlotView application.
 * Integrates all subcomponents and manages application state.
 */

import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Stack, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Upload } from 'lucide-react';

// Import components
import ChartControls from './components/ChartControls';
import DataSelector from './components/DataSelector';
import TimeRangeSlider from './components/TimeRangeSlider';
import ChartDisplay from './components/ChartDisplay';
import SignalStatistics from './components/SignalStatistics';

// Import hooks
import { useCsvData } from './hooks/useCsvData';
import { useTimeRange } from './hooks/useTimeRange';
import { useChartData } from './hooks/useChartData';

// Import types and utilities
import { TimeResolution } from './types';
import { convertTimeValue, formatTimeValue } from './utils/timeFormatters';

const PlotView: React.FC = () => {
  // CSV data handling with custom hook
  const {
    csvData,
    columns,
    columnInfo,
    filename,
    isLoading,
    error,
    selectedColumns,
    setSelectedColumns,
    timeColumn,
    setTimeColumn,
    globalTimeRange,
    handleFileUpload,
    getYDomain
  } = useCsvData();

  // Time resolution state
  const [timeResolution, setTimeResolution] = useState<TimeResolution>('seconds');

  // Time range handling with custom hook
  const {
    timeRange,
    getSliderValue,
    handleTimeRangeChange,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handlePan,
    handleJumpToEdge
  } = useTimeRange({ globalRange: globalTimeRange });

  // Chart data processing with custom hook
  const { getChartData, getTimeStats } = useChartData({
    csvData,
    selectedColumns,
    timeColumn,
    timeRange,
    timeResolution
  });

  // Calculate derived values
  const chartData = getChartData();
  const yDomain = getYDomain();
  const sliderValue = getSliderValue();
  const timeStats = getTimeStats();
  
  // Format visible range for display
  const visibleRangeFormatted = formatTimeValue(
    convertTimeValue(timeStats.visibleRangeMs, timeResolution),
    timeColumn,
    timeResolution
  );

  // Handle column selection
  const handleColumnSelect = (event: SelectChangeEvent<string[]>) => {
    setSelectedColumns(event.target.value as string[]);
  };
  
  // Handle time column selection
  const handleTimeColumnSelect = (event: SelectChangeEvent<string>) => {
    setTimeColumn(event.target.value as string);
  };
  
  // Handle time resolution change
  const handleTimeResolutionChange = (
    event: React.MouseEvent<HTMLElement>,
    newResolution: TimeResolution | null
  ) => {
    if (newResolution !== null) {
      setTimeResolution(newResolution);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      overflow: 'auto',
      // Hide scrollbar for different browsers while maintaining functionality
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {  // Chrome, Safari, Edge
        display: 'none'
      },
      msOverflowStyle: 'none', // IE and Edge
    }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontSize: '2rem' }}>
          Metrics Plot View
        </Typography>
        
        {/* CSV Upload Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              component="label"
              startIcon={<Upload size={20} />}
              disabled={isLoading}
              sx={{ fontSize: '0.875rem', padding: '6px 12px' }}
            >
              Upload CSV
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button>
            
            {isLoading && <CircularProgress size={20} />}
            
            {filename && !isLoading && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                File: {filename}
              </Typography>
            )}
            
            {error && (
              <Alert severity="error" sx={{ flexGrow: 1, fontSize: '0.875rem' }}>
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Data Selection Controls */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <DataSelector
                columns={columns}
                columnInfo={columnInfo}
                selectedColumns={selectedColumns}
                onColumnSelect={handleColumnSelect}
                timeColumn={timeColumn}
                onTimeColumnSelect={handleTimeColumnSelect}
                timeResolution={timeResolution}
                onTimeResolutionChange={handleTimeResolutionChange}
                disabled={columns.length === 0}
              />
            </Paper>
          </Grid>
          
          {/* Main Chart Container */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, height: 400 }}>
              {/* Chart Title and Controls */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
                  {selectedColumns.length ? 'Signal Values Over Time' : 'Upload a CSV file to view data'}
                </Typography>
                
                {/* Navigation Controls */}
                {csvData.length > 0 && selectedColumns.length > 0 && (
                  <ChartControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onResetZoom={handleResetZoom}
                    onPan={handlePan}
                    onJumpToEdge={handleJumpToEdge}
                  />
                )}
              </Box>
              
              {/* Time Range Slider */}
              {csvData.length > 0 && selectedColumns.length > 0 && timeColumn === 'elapsed_ms' && (
                <TimeRangeSlider
                  sliderValue={sliderValue}
                  globalTimeRange={globalTimeRange}
                  timeResolution={timeResolution}
                  timeColumn={timeColumn}
                  visibleRangeFormatted={visibleRangeFormatted}
                  percentVisible={timeStats.percentVisible}
                  onRangeChange={handleTimeRangeChange}
                />
              )}
              
              {/* Main Chart */}
              <Box 
                sx={{ 
                  height: 'calc(100% - 80px)',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <ChartDisplay 
                  chartData={chartData}
                  selectedColumns={selectedColumns}
                  timeColumn={timeColumn}
                  timeResolution={timeResolution}
                  yDomain={yDomain}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Data info panel with selected time range details */}
          {csvData.length > 0 && selectedColumns.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                        Visible Time Range
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                        {formatTimeValue(convertTimeValue(timeRange.start, timeResolution), timeColumn, timeResolution)} — 
                        {formatTimeValue(convertTimeValue(timeRange.end, timeResolution), timeColumn, timeResolution)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                        Points Visible
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                        {chartData.length} / {csvData.length} ({timeStats.percentVisible}%)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          
          {/* Signal Statistics */}
          {selectedColumns.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <SignalStatistics 
                  selectedColumns={selectedColumns}
                  columnInfo={columnInfo}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default PlotView;