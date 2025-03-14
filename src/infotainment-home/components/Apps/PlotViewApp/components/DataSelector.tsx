/**
 * Component for selecting data columns and time configuration.
 * Provides controls for choosing time axis, signals, and time resolution.
 */

import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { ColumnInfo, TimeResolution } from '../types';

interface DataSelectorProps {
  columns: string[];
  columnInfo: Record<string, ColumnInfo>;
  selectedColumns: string[];
  onColumnSelect: (event: SelectChangeEvent<string[]>) => void;
  timeColumn: string;
  onTimeColumnSelect: (event: SelectChangeEvent<string>) => void;
  timeResolution: TimeResolution;
  onTimeResolutionChange: (
    event: React.MouseEvent<HTMLElement>,
    newResolution: TimeResolution | null
  ) => void;
  disabled: boolean;
}

const DataSelector: React.FC<DataSelectorProps> = ({
  columns,
  columnInfo,
  selectedColumns,
  onColumnSelect,
  timeColumn,
  onTimeColumnSelect,
  timeResolution,
  onTimeResolutionChange,
  disabled
}) => {
  return (
    <Grid container spacing={2}>
      {/* Time Column Selector */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth disabled={disabled}>
          <InputLabel id="time-column-label" sx={{ fontSize: '0.875rem' }}>Time Axis</InputLabel>
          <Select
            labelId="time-column-label"
            value={timeColumn}
            onChange={onTimeColumnSelect}
            label="Time Axis"
            sx={{ fontSize: '0.875rem' }}
          >
            {columns.map(col => (
              <MenuItem key={col} value={col} sx={{ fontSize: '0.875rem' }}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* Signal Columns Selector */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={disabled}>
          <InputLabel id="columns-label" sx={{ fontSize: '0.875rem' }}>Select Signals</InputLabel>
          <Select
            labelId="columns-label"
            multiple
            value={selectedColumns}
            onChange={onColumnSelect}
            input={<OutlinedInput label="Select Signals" sx={{ fontSize: '0.875rem' }} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" sx={{ fontSize: '0.75rem' }} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 240,
                },
              },
            }}
          >
            {columns
              .filter(col => col !== timeColumn && columnInfo[col]?.type === 'number')
              .map(col => (
                <MenuItem key={col} value={col} sx={{ fontSize: '0.875rem' }}>
                  <Checkbox checked={selectedColumns.indexOf(col) > -1} size="small" />
                  <ListItemText primary={col} sx={{ fontSize: '0.875rem' }} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* Time Resolution Selection */}
      <Grid item xs={12} md={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
            Time Resolution
          </Typography>
          <ToggleButtonGroup
            value={timeResolution}
            exclusive
            onChange={onTimeResolutionChange}
            aria-label="time resolution"
            disabled={disabled || timeColumn !== 'elapsed_ms'}
            size="small"
            sx={{ justifySelf: 'flex-end' }}
          >
            <ToggleButton value="milliseconds" sx={{ fontSize: '0.75rem', padding: '4px 8px' }}>
              ms
            </ToggleButton>
            <ToggleButton value="seconds" sx={{ fontSize: '0.75rem', padding: '4px 8px' }}>
              sec
            </ToggleButton>
            <ToggleButton value="minutes" sx={{ fontSize: '0.75rem', padding: '4px 8px' }}>
              min
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DataSelector;