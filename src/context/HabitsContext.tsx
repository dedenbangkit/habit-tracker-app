import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Habit, HabitFormData } from '../types';
import {
  loadHabits,
  saveHabits,
  createNewHabit,
  processHabitForNewDay,
  incrementHabit as incrementHabitUtil,
  decrementHabit as decrementHabitUtil,
  updateHabitDetails,
} from '../utils';

interface HabitsContextValue {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (data: HabitFormData) => Promise<void>;
  updateHabit: (id: string, data: HabitFormData) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  incrementHabit: (id: string) => Promise<void>;
  decrementHabit: (id: string) => Promise<void>;
  getHabitById: (id: string) => Habit | undefined;
  refreshHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined);

interface HabitsProviderProps {
  children: ReactNode;
}

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process all habits for potential date change
  const processHabitsForNewDay = useCallback((habitsList: Habit[]): Habit[] => {
    return habitsList.map(habit => processHabitForNewDay(habit));
  }, []);

  // Load habits from storage on mount
  const loadAndProcessHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedHabits = await loadHabits();
      const processedHabits = processHabitsForNewDay(loadedHabits);

      // Save processed habits if any changed (date rollover)
      const hasChanges = loadedHabits.some((h, i) =>
        h.todayCount !== processedHabits[i].todayCount ||
        h.lastCheckDate !== processedHabits[i].lastCheckDate
      );

      if (hasChanges) {
        await saveHabits(processedHabits);
      }

      setHabits(processedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  }, [processHabitsForNewDay]);

  useEffect(() => {
    loadAndProcessHabits();
  }, [loadAndProcessHabits]);

  // Add a new habit
  const addHabit = useCallback(async (data: HabitFormData) => {
    const newHabit = createNewHabit(data.name, data.emoji, data.targetPerDay);
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  // Update an existing habit
  const updateHabit = useCallback(async (id: string, data: HabitFormData) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        return updateHabitDetails(habit, data.name, data.emoji, data.targetPerDay);
      }
      return habit;
    });
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  // Delete a habit
  const deleteHabit = useCallback(async (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  // Increment habit count
  const incrementHabit = useCallback(async (id: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        return incrementHabitUtil(habit);
      }
      return habit;
    });
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  // Decrement habit count
  const decrementHabit = useCallback(async (id: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        return decrementHabitUtil(habit);
      }
      return habit;
    });
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  }, [habits]);

  // Get habit by ID
  const getHabitById = useCallback((id: string): Habit | undefined => {
    return habits.find(habit => habit.id === id);
  }, [habits]);

  // Refresh habits (re-process for date change)
  const refreshHabits = useCallback(async () => {
    await loadAndProcessHabits();
  }, [loadAndProcessHabits]);

  const value: HabitsContextValue = {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    incrementHabit,
    decrementHabit,
    getHabitById,
    refreshHabits,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}

/**
 * Hook to access habits context
 */
export function useHabits(): HabitsContextValue {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
