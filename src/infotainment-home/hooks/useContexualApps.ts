// src/infotainment-home/navigation/hooks/useContextualApps.ts
import { useState, useEffect } from 'react';
import { useVehicleData } from '../hooks/vehicle-hooks';
import { INVERTER_KEYS } from '../constants/can-keys';
import { AppItem } from '@/types/navigation';
import { contextualApps } from '@/config/navigation';

export const useContextualApps = (): AppItem[] => {
  const [visibleContextualApps, setVisibleContextualApps] = useState<AppItem[]>([]);
  const { data: vehicleData } = useVehicleData();
  
  useEffect(() => {
    const newContextualApps: AppItem[] = [];
    
    // Check if inverter state is 9 (charging)
    const inverterState = vehicleData?.[INVERTER_KEYS.INV_STATE];
    if (inverterState === 9) {
      const chargingApp = contextualApps.find(app => app.key === 'charging');
      if (chargingApp) {
        newContextualApps.push(chargingApp);
      }
    }
    
    // Add more conditions for other contextual apps here
    
    setVisibleContextualApps(newContextualApps);
  }, [vehicleData]);
  
  return visibleContextualApps;
};