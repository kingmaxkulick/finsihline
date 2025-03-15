// DriverAvatar.tsx
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Driver } from './types';

interface DriverAvatarProps {
  driver: Driver;
}

const DriverAvatar = ({ driver }: DriverAvatarProps): React.ReactElement => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#9c27b0'
        }}
      >
        {driver.name.charAt(0)}
      </Avatar>
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 1)'
          }}
        >
          {driver.name}
        </Typography>
      </Box>
    </Stack>
  );
};

export default DriverAvatar;