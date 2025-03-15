// src/infotainment-home/navigation/config.tsx
import React from 'react';
import {
  Navigation,
  Music2,
  Phone,
  Settings,
  Radio,
  Calendar,
  Grid as GridIcon,
  Camera,
  Thermometer,
  BarChart,
  Terminal,
  BatteryCharging
} from 'lucide-react';
import { AppItem, AppGroup } from '@/types/navigation';

// Primary apps for bottom navigation
export const primaryApps: AppItem[] = [
  { icon: <Navigation size={22} />, label: 'Navigation', key: 'navigation' },
  { icon: <Terminal size={22} />, label: 'Dev', key: 'dev' },
  { icon: <Thermometer size={22} />, label: 'Climate', key: 'climate' },
  { icon: <GridIcon size={22} />, label: 'Apps', key: 'apps' }
];

// Secondary apps for the app drawer
export const secondaryApps: AppItem[] = [
  { icon: <Music2 size={22} />, label: 'Music', key: 'music' },
  { icon: <Phone size={22} />, label: 'Phone', key: 'phone' },
  { icon: <Radio size={22} />, label: 'Radio', key: 'radio' },
  { icon: <BarChart size={22} />, label: 'Plot View', key: 'plot-view' },
  { icon: <Calendar size={22} />, label: 'Calendar', key: 'calendar' },
  { icon: <Camera size={22} />, label: 'Camera', key: 'camera' },
  { icon: <Settings size={22} />, label: 'Settings', key: 'settings' }
];

// Contextual apps that appear based on vehicle state
export const contextualApps: AppItem[] = [
  { icon: <BatteryCharging size={22} />, label: 'Charging', key: 'charging' }
];

// Group apps by category for potential future categorized drawers
export const appGroups: AppGroup[] = [
  {
    title: 'Media',
    items: [
      { icon: <Music2 size={22} />, label: 'Music', key: 'music' },
      { icon: <Radio size={22} />, label: 'Radio', key: 'radio' }
    ]
  },
  {
    title: 'Utilities',
    items: [
      { icon: <Phone size={22} />, label: 'Phone', key: 'phone' },
      { icon: <Calendar size={22} />, label: 'Calendar', key: 'calendar' },
      { icon: <Camera size={22} />, label: 'Camera', key: 'camera' }
    ]
  },
  {
    title: 'Technical',
    items: [
      { icon: <BarChart size={22} />, label: 'Plot View', key: 'plot-view' },
      { icon: <Terminal size={22} />, label: 'Dev', key: 'dev' },
      { icon: <Settings size={22} />, label: 'Settings', key: 'settings' }
    ]
  }
];