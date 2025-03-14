/**
 * Navigation controls for chart interaction.
 * Provides buttons for zooming, panning, and jumping to data edges.
 */

import React from 'react';
import { Stack, IconButton, Tooltip } from '@mui/material';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface ChartControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPan: (direction: 'left' | 'right') => void;
  onJumpToEdge: (edge: 'start' | 'end') => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPan,
  onJumpToEdge
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Jump to Start">
        <IconButton onClick={() => onJumpToEdge('start')} size="small">
          <ChevronsLeft size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Pan Left">
        <IconButton onClick={() => onPan('left')} size="small">
          <ArrowLeft size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={onZoomOut} size="small">
          <ZoomOut size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset View">
        <IconButton onClick={onResetZoom} size="small">
          <RefreshCw size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom In">
        <IconButton onClick={onZoomIn} size="small">
          <ZoomIn size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Pan Right">
        <IconButton onClick={() => onPan('right')} size="small">
          <ArrowRight size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Jump to End">
        <IconButton onClick={() => onJumpToEdge('end')} size="small">
          <ChevronsRight size={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ChartControls;