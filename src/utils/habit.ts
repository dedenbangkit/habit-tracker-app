import { Habit, DayRecord } from '../types';
import { getTodayString, getYesterdayString, isSameDay, daysBetween, getLastNDays } from './date';

/**
 * Generate a unique ID for a new habit
 */
export function generateHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new habit with default values
 */
export function createNewHabit(name: string, emoji: string, targetPerDay: number): Habit {
  const today = getTodayString();

  return {
    id: generateHabitId(),
    name: name.trim(),
    emoji: emoji || '🎯',
    targetPerDay: Math.max(1, targetPerDay),
    todayCount: 0,
    streak: 0,
    totalCompletions: 0,
    lastCheckDate: today,
    history: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Check if a habit's target is completed for today
 */
export function isHabitCompletedToday(habit: Habit): boolean {
  return habit.todayCount >= habit.targetPerDay;
}

/**
 * Process a habit for a new day - reset today count and update streak
 * This should be called when the app detects a date change
 */
export function processHabitForNewDay(habit: Habit): Habit {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // If already processed for today, return as-is
  if (isSameDay(habit.lastCheckDate, today)) {
    return habit;
  }

  // Save yesterday's record to history if it was the last check date
  const updatedHistory = [...habit.history];
  if (habit.lastCheckDate) {
    const wasCompleted = habit.todayCount >= habit.targetPerDay;

    // Only add to history if there was activity or it was yesterday
    if (isSameDay(habit.lastCheckDate, yesterday) || habit.todayCount > 0) {
      // Remove existing record for that date if any
      const existingIndex = updatedHistory.findIndex(r => r.date === habit.lastCheckDate);
      if (existingIndex >= 0) {
        updatedHistory[existingIndex] = {
          date: habit.lastCheckDate,
          count: habit.todayCount,
          completed: wasCompleted,
        };
      } else {
        updatedHistory.unshift({
          date: habit.lastCheckDate,
          count: habit.todayCount,
          completed: wasCompleted,
        });
      }
    }
  }

  // Keep only last 30 days of history
  const trimmedHistory = updatedHistory.slice(0, 30);

  // Calculate new streak
  let newStreak = habit.streak;
  const wasCompletedYesterday = habit.lastCheckDate === yesterday && habit.todayCount >= habit.targetPerDay;
  const daysMissed = daysBetween(habit.lastCheckDate, today);

  if (daysMissed > 1) {
    // Missed more than one day, reset streak
    newStreak = 0;
  } else if (daysMissed === 1 && !wasCompletedYesterday) {
    // Missed yesterday (didn't complete target), reset streak
    newStreak = 0;
  }
  // If yesterday was completed, streak continues (will be updated on today's completion)

  return {
    ...habit,
    todayCount: 0,
    lastCheckDate: today,
    streak: newStreak,
    history: trimmedHistory,
  };
}

/**
 * Increment habit count for today
 */
export function incrementHabit(habit: Habit): Habit {
  const today = getTodayString();

  // Process for new day first if needed
  let updatedHabit = processHabitForNewDay(habit);

  const newCount = updatedHabit.todayCount + 1;
  const wasCompleted = updatedHabit.todayCount >= updatedHabit.targetPerDay;
  const isNowCompleted = newCount >= updatedHabit.targetPerDay;

  // Update streak when completing for the first time today
  let newStreak = updatedHabit.streak;
  if (!wasCompleted && isNowCompleted) {
    newStreak = updatedHabit.streak + 1;
  }

  return {
    ...updatedHabit,
    todayCount: newCount,
    totalCompletions: updatedHabit.totalCompletions + 1,
    streak: newStreak,
    lastCheckDate: today,
  };
}

/**
 * Decrement habit count for today (undo)
 */
export function decrementHabit(habit: Habit): Habit {
  const today = getTodayString();

  // Process for new day first if needed
  let updatedHabit = processHabitForNewDay(habit);

  // Can't go below 0
  if (updatedHabit.todayCount <= 0) {
    return updatedHabit;
  }

  const wasCompleted = updatedHabit.todayCount >= updatedHabit.targetPerDay;
  const newCount = updatedHabit.todayCount - 1;
  const isStillCompleted = newCount >= updatedHabit.targetPerDay;

  // Update streak when un-completing
  let newStreak = updatedHabit.streak;
  if (wasCompleted && !isStillCompleted) {
    newStreak = Math.max(0, updatedHabit.streak - 1);
  }

  return {
    ...updatedHabit,
    todayCount: newCount,
    totalCompletions: Math.max(0, updatedHabit.totalCompletions - 1),
    streak: newStreak,
  };
}

/**
 * Get the last 7 days history for a habit
 */
export function getLast7DaysHistory(habit: Habit): DayRecord[] {
  const last7Days = getLastNDays(7);
  const today = getTodayString();

  return last7Days.map(date => {
    if (date === today) {
      return {
        date,
        count: habit.todayCount,
        completed: habit.todayCount >= habit.targetPerDay,
      };
    }

    const historyRecord = habit.history.find(r => r.date === date);
    return historyRecord || { date, count: 0, completed: false };
  });
}

/**
 * Update habit details (for editing)
 */
export function updateHabitDetails(
  habit: Habit,
  name: string,
  emoji: string,
  targetPerDay: number
): Habit {
  return {
    ...habit,
    name: name.trim(),
    emoji: emoji || habit.emoji,
    targetPerDay: Math.max(1, targetPerDay),
  };
}
