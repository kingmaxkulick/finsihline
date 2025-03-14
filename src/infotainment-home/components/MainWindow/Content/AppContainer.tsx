/** 

AppContainer Component

This component acts as a **wrapper** for the infotainment system's main content. 
It ensures that the app UI is properly structured and displayed.

Props:
- `children` (React.ReactNode): The infotainment app content to be displayed.
- `isOpen` (boolean): Determines whether the content should be visible.
- `onClose` (function): Callback function to close the infotainment window.

Behavior:
- If `isOpen` is `true`, it renders a **DraggableView** with the app content.
- Provides a structured container with controlled overflow to prevent layout issues.
- Acts as a layout manager, ensuring infotainment content is properly displayed.

 */

import React from 'react';
import { Box } from '@mui/material';
import DraggableView from "../Draggable/DraggableView";

interface AppContainerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const AppContainer: React.FC<AppContainerProps> = ({ children, isOpen, onClose }) => {
  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        // Ensure it fills the space between top-bar and nav-bar
        height: '100%',
        // Prevent content from overflowing
        overflow: 'hidden'
      }}
    >
      {isOpen && <DraggableView onClose={onClose}>{children}</DraggableView>}
    </Box>
  )
}

export default AppContainer
