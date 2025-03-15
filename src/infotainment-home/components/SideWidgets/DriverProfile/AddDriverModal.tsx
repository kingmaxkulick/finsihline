// AddDriverModal.tsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface AddDriverModalProps {
  open: boolean;
  onClose: () => void;
  onAddDriver: (name: string) => void;
}

const AddDriverModal = ({ open, onClose, onAddDriver }: AddDriverModalProps): React.ReactElement => {
  const [newDriverName, setNewDriverName] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewDriverName(e.target.value);
  };

  const handleSubmit = (): void => {
    if (newDriverName.trim()) {
      onAddDriver(newDriverName);
      setNewDriverName('');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-driver-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'rgba(220, 220, 225, 0.8)',
          borderRadius: 1,
          p: 3,
          outline: 'none'
        }}
      >
        <Typography variant="body1" sx={{ mb: 2, color: 'rgba(0, 0, 0, 1)' }}>
          Add New Driver
        </Typography>
        <TextField
          fullWidth
          label="Driver Name"
          value={newDriverName}
          onChange={handleNameChange}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#9c27b0'
              },
              '&:hover fieldset': {
                borderColor: '#9c27b0'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#9c27b0'
              }
            }
          }}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} sx={{ color: '#9c27b0' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!newDriverName.trim()}
            sx={{
              bgcolor: '#9c27b0',
              '&:hover': {
                bgcolor: '#7b1fa2'
              }
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddDriverModal;