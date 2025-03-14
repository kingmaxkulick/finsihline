/**
 * Type definitions for the PlotView application.
 * Defines interfaces for CSV data, column information, time resolutions, and range selection.
 */

// Interface for parsed CSV data
export interface CsvData {
    timestamp: string;
    elapsed_ms: number;
    [key: string]: any;
  }
  
  // Interface for CSV column info
  export interface ColumnInfo {
    name: string;
    min: number;
    max: number;
    avg: number;
    type: 'number' | 'string' | 'unknown';
  }
  
  // Time resolution options
  export type TimeResolution = 'milliseconds' | 'seconds' | 'minutes';
  
  // Range selection interfaces
  export interface TimeRange {
    start: number;
    end: number;
  }