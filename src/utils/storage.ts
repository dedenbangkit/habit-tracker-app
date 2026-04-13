import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, AppSettings } from '../types';
import { StorageKeys, APP_VERSION } from '../constants';

/**
 * Save habits to AsyncStorage
 */
export async function saveHabits(habits: Habit[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(StorageKeys.HABITS, jsonValue);
  } catch (error) {
    console.error('Error saving habits:', error);
    throw error;
  }
}

/**
 * Load habits from AsyncStorage
 */
export async function loadHabits(): Promise<Habit[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.HABITS);
    if (jsonValue === null) {
      return [];
    }
    return JSON.parse(jsonValue) as Habit[];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
}

/**
 * Save app settings to AsyncStorage
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(StorageKeys.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

/**
 * Load app settings from AsyncStorage
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const jsonValue = await AsyncStorage.getItem(StorageKeys.SETTINGS);
    if (jsonValue === null) {
      return getDefaultSettings();
    }
    return JSON.parse(jsonValue) as AppSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Get default app settings
 */
export function getDefaultSettings(): AppSettings {
  return {
    darkMode: false,
    version: APP_VERSION,
  };
}

/**
 * Clear all app data (habits and settings)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([StorageKeys.HABITS, StorageKeys.SETTINGS]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
