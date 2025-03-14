/**
 * Custom hook for managing time range state and operations.
 * Provides functionality for zooming, panning, and navigating time ranges.
 */

import { useState, useCallback } from 'react';
import { TimeRange } from '../types';

export interface UseTimeRangeProps {
  initialRange?: TimeRange;
  globalRange: TimeRange;
}

export interface UseTimeRangeReturn {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  getSliderValue: () => number[];
  handleTimeRangeChange: (event: Event, newValue: number | number[]) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handlePan: (direction: 'left' | 'right') => void;
  handleJumpToEdge: (edge: 'start' | 'end') => void;
}

export const useTimeRange = ({ 
  initialRange, 
  globalRange 
}: UseTimeRangeProps): UseTimeRangeReturn => {
  const [timeRange, setTimeRange] = useState<TimeRange>(
    initialRange || { start: globalRange.start, end: globalRange.end }
  );

  // Calculate slider range values (0-100)
  const getSliderValue = useCallback((): number[] => {
    if (globalRange.start === globalRange.end) return [0, 100];
    
    const totalRange = globalRange.end - globalRange.start;
    const startPercent = ((timeRange.start - globalRange.start) / totalRange) * 100;
    const endPercent = ((timeRange.end - globalRange.start) / totalRange) * 100;
    
    return [startPercent, endPercent];
  }, [timeRange, globalRange]);

  // Handle time range slider changes
  const handleTimeRangeChange = useCallback((event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      setTimeRange({
        start: (start / 100) * (globalRange.end - globalRange.start) + globalRange.start,
        end: (end / 100) * (globalRange.end - globalRange.start) + globalRange.start
      });
    }
  }, [globalRange]);

  // Zoom in - increase detail by showing a narrower range
  const handleZoomIn = useCallback(() => {
    const range = timeRange.end - timeRange.start;
    const center = (timeRange.start + timeRange.end) / 2;
    const newRange = range / 2;
    
    setTimeRange({
      start: Math.max(globalRange.start, center - newRange / 2),
      end: Math.min(globalRange.end, center + newRange / 2)
    });
  }, [timeRange, globalRange]);

  // Zoom out - decrease detail by showing a wider range
  const handleZoomOut = useCallback(() => {
    const range = timeRange.end - timeRange.start;
    const center = (timeRange.start + timeRange.end) / 2;
    const newRange = range * 2;
    
    setTimeRange({
      start: Math.max(globalRange.start, center - newRange / 2),
      end: Math.min(globalRange.end, center + newRange / 2)
    });
  }, [timeRange, globalRange]);

  // Reset zoom to show full range
  const handleResetZoom = useCallback(() => {
    setTimeRange({
      start: globalRange.start,
      end: globalRange.end
    });
  }, [globalRange]);

  // Pan left/right
  const handlePan = useCallback((direction: 'left' | 'right') => {
    const range = timeRange.end - timeRange.start;
    const panAmount = range * 0.2; // Pan by 20% of the visible range
    
    if (direction === 'left') {
      setTimeRange({
        start: Math.max(globalRange.start, timeRange.start - panAmount),
        end: timeRange.end - panAmount
      });
    } else {
      setTimeRange({
        start: timeRange.start + panAmount,
        end: Math.min(globalRange.end, timeRange.end + panAmount)
      });
    }
  }, [timeRange, globalRange]);

  // Jump to start/end
  const handleJumpToEdge = useCallback((edge: 'start' | 'end') => {
    const range = timeRange.end - timeRange.start;
    
    if (edge === 'start') {
      setTimeRange({
        start: globalRange.start,
        end: globalRange.start + range
      });
    } else {
      setTimeRange({
        start: globalRange.end - range,
        end: globalRange.end
      });
    }
  }, [timeRange, globalRange]);

  return {
    timeRange,
    setTimeRange,
    getSliderValue,
    handleTimeRangeChange,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handlePan,
    handleJumpToEdge
  };
};