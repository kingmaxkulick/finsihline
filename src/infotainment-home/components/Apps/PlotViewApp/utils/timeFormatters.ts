/**
 * Utility functions for handling time values in the PlotView application.
 * Provides functions for converting, formatting, and labeling time values.
 */

import { TimeResolution } from '../types';
import { TIME_FACTORS } from './constants';

// Convert raw time data to the current resolution
export const convertTimeValue = (msValue: number, timeResolution: TimeResolution): number => {
  return msValue / TIME_FACTORS[timeResolution];
};

// Format time values for display based on selected resolution
export const formatTimeValue = (value: any, timeColumn: string, timeResolution: TimeResolution): string => {
  if (timeColumn === 'timestamp' && typeof value === 'string') {
    // Handle timestamp strings
    try {
      const date = new Date(value);
      return date.toLocaleTimeString();
    } catch {
      return value;
    }
  } else if (timeColumn === 'elapsed_ms' && typeof value === 'number') {
    // Format based on the selected time unit
    switch (timeResolution) {
      case 'milliseconds':
        return `${value.toFixed(0)} ms`;
      case 'seconds':
        return `${value.toFixed(2)} s`;
      case 'minutes':
        const minutes = Math.floor(value / 60);
        const seconds = (value % 60).toFixed(1);
        return `${minutes}:${seconds.padStart(4, '0')}`;
    }
  }
  // Default fallback
  return String(value);
};

// Get the appropriate time unit label
export const getTimeUnitLabel = (timeResolution: TimeResolution): string => {
  switch (timeResolution) {
    case 'milliseconds':
      return 'Time (ms)';
    case 'seconds':
      return 'Time (sec)';
    case 'minutes':
      return 'Time (min)';
    default:
      return 'Time';
  }
};