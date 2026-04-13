import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Habit } from '../types';
import { useSettings } from '../context';
import { BorderRadius, Spacing, FontSize } from '../constants';
import { isHabitCompletedToday } from '../utils';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function HabitCard({ habit, onPress, onIncrement, onDecrement }: HabitCardProps) {
  const { colors } = useSettings();
  const isCompleted = isHabitCompletedToday(habit);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isCompleted ? colors.successLight : colors.surface,
          borderColor: isCompleted ? colors.success : colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {/* Emoji and Info */}
        <View style={styles.leftSection}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <View style={styles.info}>
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {habit.name}
            </Text>
            <View style={styles.statsRow}>
              <Text style={[styles.progress, { color: colors.textSecondary }]}>
                {habit.todayCount}/{habit.targetPerDay} today
              </Text>
              {habit.streak > 0 && (
                <Text style={[styles.streak, { color: colors.primary }]}>
                  🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {habit.todayCount > 0 && (
            <TouchableOpacity
              style={[styles.decrementButton, { backgroundColor: colors.surfaceSecondary }]}
              onPress={onDecrement}
              activeOpacity={0.7}
            >
              <Text style={[styles.decrementText, { color: colors.textSecondary }]}>−</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.incrementButton,
              {
                backgroundColor: isCompleted ? colors.success : colors.primary,
              },
            ]}
            onPress={onIncrement}
            activeOpacity={0.7}
          >
            <Text style={styles.incrementText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progress: {
    fontSize: FontSize.sm,
  },
  streak: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  incrementButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  decrementButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
