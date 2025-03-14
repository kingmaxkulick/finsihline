/**
 * Component for rendering the line chart visualization.
 * Shows signal values over time with configurable display options.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { TimeResolution } from '../types';
import { COLORS } from '../utils/constants';
import { formatTimeValue, getTimeUnitLabel } from '../utils/timeFormatters';

interface ChartDisplayProps {
  chartData: any[];
  selectedColumns: string[];
  timeColumn: string;
  timeResolution: TimeResolution;
  yDomain: [number, number];
  emptyMessage?: string;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  selectedColumns,
  timeColumn,
  timeResolution,
  yDomain,
  emptyMessage = "Upload a CSV file to visualize data"
}) => {
  if (chartData.length === 0 || selectedColumns.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {chartData.length === 0 
            ? emptyMessage 
            : "Select at least one signal to plot"}
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={chartData} 
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={timeColumn} 
          tickFormatter={(value) => formatTimeValue(value, timeColumn, timeResolution)}
          label={{ 
            value: getTimeUnitLabel(timeResolution), 
            position: 'insideBottomRight', 
            offset: -10,
            fontSize: '0.75rem',
          }}
          type={timeColumn === 'elapsed_ms' ? 'number' : 'category'}
          domain={timeColumn === 'elapsed_ms' ? ['auto', 'auto'] : undefined}
          tick={{ fontSize: '0.75rem' }}
        />
        <YAxis 
          domain={yDomain}
          label={{ 
            value: 'Value', 
            angle: -90, 
            position: 'insideLeft',
            offset: -5,
            fontSize: '0.75rem',
          }}
          tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
          tick={{ fontSize: '0.75rem' }}
        />
        <RechartsTooltip 
          formatter={(value, name) => [
            typeof value === 'number' ? value.toFixed(2) : value,
            name
          ]}
          labelFormatter={(value) => {
            if (timeColumn === 'elapsed_ms') {
              return `Time: ${formatTimeValue(value, timeColumn, timeResolution)}`;
            }
            return `Time: ${value}`;
          }}
          contentStyle={{ fontSize: '0.75rem' }}
        />
        <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
        {selectedColumns.map((column, index) => (
          <Line
            key={column}
            type="monotone"
            dataKey={column}
            stroke={COLORS[index % COLORS.length]}
            dot={chartData.length < 100} // Only show dots if fewer than 100 points
            activeDot={{ r: 6 }} // Smaller active dot
            name={column}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartDisplay;