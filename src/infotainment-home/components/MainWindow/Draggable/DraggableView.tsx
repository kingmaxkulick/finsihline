/** 

DraggableView Component

This component provides a draggable bottom sheet UI, allowing users 
to pull up content from the bottom of the screen and dismiss it by dragging down.

It is typically used to display modal-like infotainment overlays while 
keeping the main interface visible in the background.

Props:
- `onClose` (function): Callback function triggered when the user drags the view down past the threshold.
- `children` (ReactNode): The content to be displayed inside the draggable view.
- `containerZIndex` (number, optional): Controls the z-index of the draggable view (default is `1`).

Features:
- Smooth Dragging Animation: Uses `useDragGesture` hook to handle touch/mouse dragging.
- Dismiss Threshold: If dragged down beyond `150px`, it triggers `onClose()`, dismissing the view.
- Theming Support: Uses Material-UI theming for styling and responsiveness.
- Background Dimming: The background fades as the user drags the view up/down.
- Styled Components:
  - `DraggableContainer`: Ensures the draggable view stays within the main content area.
  - `DragHandle`: A grab area at the top for user interaction.
  - `DragIndicator`: A small bar to indicate the draggable handle.

 */


import React, { useState, useRef, ReactNode } from 'react';
import { Paper, Box, useTheme, styled, alpha, Theme } from '@mui/material';
import { useDragGesture } from './useDragGesture';

const DISMISS_THRESHOLD = 150;

interface DraggableViewProps {
  onClose: () => void;
  children: ReactNode;
  containerZIndex?: number;
}

const ContentWrapper = styled(Box)({
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
});

// Create a container that stays within the main content area
const DraggableContainer = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  overflow: 'hidden'
});

const DragIndicator = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: 48,
  height: 4,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.text.secondary, 0.2)
}));

const DragHandle = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: '100%',
  height: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing'
  }
}));

const DraggableView: React.FC<DraggableViewProps> = ({
  onClose,
  children,
  containerZIndex = 1
}): JSX.Element => {
  const theme = useTheme();
  const { 
    isDragging, 
    dragY, 
    handleTouchStart, 
    setDragY 
  } = useDragGesture({ 
    onClose, 
    dismissThreshold: DISMISS_THRESHOLD 
  });

  return (
    <DraggableContainer
      sx={{
        zIndex: containerZIndex,
        backgroundColor: alpha(
          theme.palette.background.default,
          Math.max(0, 1 - (dragY / DISMISS_THRESHOLD) * 0.7)
        )
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <Paper
          elevation={8}
          sx={{
            height: '100%',
            transform: `translateY(${dragY}px)`,
            transition: isDragging
              ? 'none'
              : theme.transitions.create('transform', {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeOut
                }),
            borderTopLeftRadius: theme.shape.borderRadius * 2,
            borderTopRightRadius: theme.shape.borderRadius * 2,
            pointerEvents: 'auto',
            bgcolor: 'background.paper'
          }}
        >
          <DragHandle
            onTouchStart={handleTouchStart}
            onMouseDown={handleTouchStart}
          >
            <DragIndicator />
          </DragHandle>

          <ContentWrapper>{children}</ContentWrapper>
        </Paper>
      </Box>
    </DraggableContainer>
  );
};

export default DraggableView;