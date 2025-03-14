/**
 * Custom hook for CSV data handling and processing.
 * Manages CSV file parsing, column information, and data statistics.
 */

import { useState, useCallback, useEffect } from 'react';
import { CsvData, ColumnInfo, TimeRange } from '../types';
import { parseCSVFile, determineTimeRange } from '../utils/csvProcessing';

export interface UseCsvDataReturn {
  csvData: CsvData[];
  columns: string[];
  columnInfo: Record<string, ColumnInfo>;
  filename: string | null;
  isLoading: boolean;
  error: string | null;
  setSelectedColumns: (columns: string[]) => void;
  selectedColumns: string[];
  timeColumn: string;
  setTimeColumn: (column: string) => void;
  globalTimeRange: TimeRange;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getYDomain: () => [number, number];
}

export const useCsvData = (): UseCsvDataReturn => {
  // State for CSV data handling
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnInfo, setColumnInfo] = useState<Record<string, ColumnInfo>>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [timeColumn, setTimeColumn] = useState<string>('elapsed_ms');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>({ start: 0, end: 0 });

  // Process the CSV file
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFilename(file.name);
    setIsLoading(true);
    
    parseCSVFile(
      file,
      (parsedData, columnInfo, defaultTimeColumn) => {
        setCsvData(parsedData);
        setColumns(Object.keys(parsedData[0]));
        setColumnInfo(columnInfo);
        setSelectedColumns([]);
        setTimeColumn(defaultTimeColumn);
        
        // Determine time range
        const timeRange = determineTimeRange(parsedData, defaultTimeColumn);
        if (timeRange) {
          setGlobalTimeRange(timeRange);
        }
        
        setIsLoading(false);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsLoading(false);
      }
    );
    
    // Reset file input so the same file can be selected again
    event.target.value = '';
  }, []);

  // Get domain for Y axis - fixed to return a tuple type
  const getYDomain = useCallback((): [number, number] => {
    if (!selectedColumns.length) return [0, 100];
    
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    
    selectedColumns.forEach(col => {
      if (columnInfo[col]) {
        min = Math.min(min, columnInfo[col].min);
        max = Math.max(max, columnInfo[col].max);
      }
    });
    
    // Add some padding
    const padding = Math.max(0.1, (max - min) * 0.1);
    return [Math.max(0, min - padding), max + padding] as [number, number];
  }, [selectedColumns, columnInfo]);

  return {
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
  };
};