/**
 * Custom hook for processing data for chart visualization.
 * Handles filtering, conversion, and formatting of data for display.
 */

import { useCallback } from 'react';
import { CsvData, TimeRange, TimeResolution } from '../types';
import { processChartData } from '../utils/csvProcessing';
import { convertTimeValue } from '../utils/timeFormatters';

export interface UseChartDataProps {
  csvData: CsvData[];
  selectedColumns: string[];
  timeColumn: string;
  timeRange: TimeRange;
  timeResolution: TimeResolution;
}

export const useChartData = ({
  csvData,
  selectedColumns,
  timeColumn,
  timeRange,
  timeResolution
}: UseChartDataProps) => {
  
  // Process data for the chart with filtering by time range
  const getChartData = useCallback(() => {
    return processChartData(
      csvData,
      selectedColumns,
      timeColumn,
      timeRange,
      (ms: number) => convertTimeValue(ms, timeResolution)
    );
  }, [csvData, selectedColumns, timeColumn, timeRange, timeResolution]);

  // Calculate time stats
  const getTimeStats = useCallback(() => {
    const visibleRangeMs = timeRange.end - timeRange.start;
    const totalRangeMs = csvData.length ? 
      (csvData[csvData.length - 1].elapsed_ms as number) - (csvData[0].elapsed_ms as number) : 0;
    const percentVisible = totalRangeMs > 0 ? Math.round((visibleRangeMs / totalRangeMs) * 100) : 100;
    
    return {
      visibleRangeMs,
      totalRangeMs,
      percentVisible,
      totalPoints: csvData.length,
      visiblePoints: getChartData().length
    };
  }, [csvData, timeRange, getChartData]);

  return {
    getChartData,
    getTimeStats
  };
};