/**
 * Side widget that displays the current driver profile and allows
 * adding new driver profiles through a modal interface.
 */

import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { UserPlus } from 'lucide-react';

import DriverAvatar from './DriverAvatar';
import AddDriverModal from './AddDriverModal';
import { Driver, DriverProfileProps } from './types';

const DriverProfile = ({ onClick }: DriverProfileProps): React.ReactElement => {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([{ id: '1', name: 'Guest' }]);
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0].id);

  const handleAddDriver = (name: string): void => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      name: name.trim()
    };
    setDrivers([...drivers, newDriver]);
    setSelectedDriverId(newDriver.id);
    setOpenModal(false);
  };

  const handleModalClose = (): void => {
    setOpenModal(false);
  };

  // Prevent event propagation when clicking the add button
  const handleAddButtonClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const currentDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  return (
    <>
      <Paper
        elevation={0}
        onClick={onClick}
        sx={{
          bgcolor: 'rgba(220, 220, 225, 0.8)',
          borderRadius: 1,
          p: 1.5,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(0, 0, 0, 1)'
            }}
          >
            DRIVER PROFILE
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleAddButtonClick} 
            sx={{ color: '#9c27b0' }}
          >
            <UserPlus size={16} />
          </IconButton>
        </Stack>

        <DriverAvatar driver={currentDriver} />
      </Paper>

      <AddDriverModal 
        open={openModal}
        onClose={handleModalClose}
        onAddDriver={handleAddDriver}
      />
    </>
  );
};

export default DriverProfile;