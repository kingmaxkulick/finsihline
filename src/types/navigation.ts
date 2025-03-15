// src/infotainment-home/navigation/types.ts
import { ReactNode } from 'react';

export interface AppItem {
  icon: ReactNode;
  label: string;
  key: string; // Add a unique key for better identification
}

export interface AppGroup {
  title: string;
  items: AppItem[];
}

export type AppPosition = 'primary' | 'secondary' | 'contextual';