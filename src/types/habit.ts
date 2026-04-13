/**
 * Represents a single day's completion record
 */
export interface DayRecord {
  date: string; // ISO date string YYYY-MM-DD
  count: number;
  completed: boolean; // true if count >= targetPerDay
}

/**
 * Main habit data model
 */
export interface Habit {
  id: string;
  name: string;
  emoji: string;
  targetPerDay: number;
  todayCount: number;
  streak: number;
  totalCompletions: number;
  lastCheckDate: string; // ISO date string YYYY-MM-DD
  // Store last 30 days of history for weekly view and streak calculation
  history: DayRecord[];
  createdAt: string; // ISO timestamp
}

/**
 * Form data for creating/editing a habit
 */
export interface HabitFormData {
  name: string;
  emoji: string;
  targetPerDay: number;
}

/**
 * App settings stored in AsyncStorage
 */
export interface AppSettings {
  darkMode: boolean;
  version: string;
}

/**
 * Context state for habits
 */
export interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
}
