/**
 * Utility functions for processing and analyzing CSV data.
 * Handles parsing, statistics calculation, and data transformation.
 */

import Papa from 'papaparse';
import { CsvData, ColumnInfo, TimeRange } from '../types';

/**
 * Parses a CSV file and returns processed data with statistics
 */
export const parseCSVFile = (
  file: File,
  onComplete: (parsedData: CsvData[], columnInfo: Record<string, ColumnInfo>, defaultTimeColumn: string) => void,
  onError: (errorMessage: string) => void
) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    complete: (results) => {
      if (results.errors.length > 0) {
        onError(`Error parsing CSV: ${results.errors[0].message}`);
        return;
      }

      // Extract data and columns
      const parsedData = results.data as CsvData[];
      if (parsedData.length === 0) {
        onError('CSV file contains no data rows');
        return;
      }

      // Get all column names
      const allColumns = Object.keys(parsedData[0]);

      // Calculate column statistics and determine type
      const columnInfo = calculateColumnStats(parsedData, allColumns);

      // Automatically select timestamp or elapsed_ms as time column if available
      let defaultTimeColumn = 'elapsed_ms';
      if (allColumns.includes('elapsed_ms')) {
        defaultTimeColumn = 'elapsed_ms';
      } else if (allColumns.includes('timestamp')) {
        defaultTimeColumn = 'timestamp';
      }

      // Sort the data by time
      let timeData = [...parsedData];
      if (defaultTimeColumn === 'elapsed_ms') {
        timeData.sort((a, b) => (a.elapsed_ms as number) - (b.elapsed_ms as number));
      }

      onComplete(timeData, columnInfo, defaultTimeColumn);
    },
    error: (error) => {
      onError(`Error reading CSV file: ${error.message}`);
    }
  });
};

/**
 * Calculates statistics for each column in the data
 */
export const calculateColumnStats = (
  data: CsvData[],
  columns: string[]
): Record<string, ColumnInfo> => {
  const columnInfo: Record<string, ColumnInfo> = {};

  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined);
    const numericValues = values.filter(val => typeof val === 'number') as number[];

    if (numericValues.length > 0) {
      const min = parseFloat(Math.min(...numericValues).toFixed(2));
      const max = parseFloat(Math.max(...numericValues).toFixed(2));
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = parseFloat((sum / numericValues.length).toFixed(2));

      columnInfo[col] = {
        name: col,
        min,
        max,
        avg,
        type: 'number'
      };
    } else {
      columnInfo[col] = {
        name: col,
        min: 0,
        max: 0,
        avg: 0,
        type: typeof values[0] === 'string' ? 'string' : 'unknown'
      };
    }
  });

  return columnInfo;
};

/**
 * Determines the global time range from the data
 */
export const determineTimeRange = (data: CsvData[], timeColumn: string): TimeRange | null => {
  if (timeColumn !== 'elapsed_ms' || data.length === 0) return null;

  const startTime = data[0].elapsed_ms as number;
  const endTime = data[data.length - 1].elapsed_ms as number;

  return {
    start: startTime,
    end: endTime
  };
};

/**
 * Filters and processes chart data based on time range and selected columns
 */
export const processChartData = (
  csvData: CsvData[],
  selectedColumns: string[],
  timeColumn: string,
  timeRange: TimeRange,
  convertTime: (msValue: number) => number
): Record<string, any>[] => {
  if (!csvData.length || !selectedColumns.length) return [];

  // Filter data by time range
  const filteredData = csvData.filter(row => {
    if (timeColumn !== 'elapsed_ms') return true;
    
    const timeValue = row[timeColumn] as number;
    return timeValue >= timeRange.start && timeValue <= timeRange.end;
  });

  // Map to new data points
  return filteredData.map(row => {
    const rowData: Record<string, any> = {};
    
    // Handle time column - convert to appropriate unit
    if (timeColumn === 'elapsed_ms') {
      const msValue = row[timeColumn] as number;
      rowData[timeColumn] = convertTime(msValue);
      rowData.originalMs = msValue;  // Keep original for reference
    } else {
      rowData[timeColumn] = row[timeColumn];
    }
    
    // Add selected data columns
    selectedColumns.forEach(col => {
      rowData[col] = row[col];
    });
    
    return rowData;
  });
};