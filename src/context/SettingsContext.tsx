import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { AppSettings } from '../types';
import { loadSettings, saveSettings, clearAllData, getDefaultSettings } from '../utils';
import { Colors } from '../constants';

type ColorScheme = typeof Colors.light;

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  isDarkMode: boolean;
  colors: ColorScheme;
  toggleDarkMode: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    async function loadStoredSettings() {
      try {
        setIsLoading(true);
        const storedSettings = await loadSettings();
        setSettings(storedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredSettings();
  }, []);

  // Determine if dark mode is active
  const isDarkMode = settings.darkMode;

  // Get current color scheme based on dark mode setting
  const colors = isDarkMode ? Colors.dark : Colors.light;

  // Toggle dark mode
  const toggleDarkMode = useCallback(async () => {
    const newSettings = {
      ...settings,
      darkMode: !settings.darkMode,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings]);

  // Reset all app data
  const resetAllData = useCallback(async () => {
    await clearAllData();
    setSettings(getDefaultSettings());
  }, []);

  const value: SettingsContextValue = {
    settings,
    isLoading,
    isDarkMode,
    colors,
    toggleDarkMode,
    resetAllData,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to access settings context
 */
export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
