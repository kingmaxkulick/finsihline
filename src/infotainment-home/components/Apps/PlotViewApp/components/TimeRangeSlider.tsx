/**
 * Component for visualizing and adjusting the visible time range.
 * Provides a slider control and informational labels.
 */

import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { TimeResolution } from '../types';
import { formatTimeValue, convertTimeValue } from '../utils/timeFormatters';

interface TimeRangeSliderProps {
  sliderValue: number[];
  globalTimeRange: { start: number; end: number };
  timeResolution: TimeResolution;
  timeColumn: string;
  visibleRangeFormatted: string;
  percentVisible: number;
  onRangeChange: (event: Event, newValue: number | number[]) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  sliderValue,
  globalTimeRange,
  timeResolution,
  timeColumn,
  visibleRangeFormatted,
  percentVisible,
  onRangeChange
}) => {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Slider
        value={sliderValue}
        onChange={onRangeChange}
        aria-labelledby="time-range-slider"
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => {
          const ms = (value / 100) * (globalTimeRange.end - globalTimeRange.start) + globalTimeRange.start;
          return formatTimeValue(
            convertTimeValue(ms, timeResolution), 
            timeColumn, 
            timeResolution
          );
        }}
        sx={{ height: 8 }}
      />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mt: 0.5
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {formatTimeValue(
            convertTimeValue(globalTimeRange.start, timeResolution), 
            timeColumn, 
            timeResolution
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Showing {visibleRangeFormatted} range ({percentVisible}% of total)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {formatTimeValue(
            convertTimeValue(globalTimeRange.end, timeResolution), 
            timeColumn, 
            timeResolution
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeRangeSlider;