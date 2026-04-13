import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits, useSettings } from '../../context';
import { Button, WeeklyHistory, EmptyState } from '../../components';
import { getLast7DaysHistory, isHabitCompletedToday } from '../../utils';
import { Spacing, FontSize, BorderRadius } from '../../constants';
import { Habit } from '../../types';

/**
 * Stat card component for displaying habit statistics
 */
function StatCard({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string | number;
  emoji?: string;
}) {
  const { colors } = useSettings();

  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      {emoji && <Text style={styles.statEmoji}>{emoji}</Text>}
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Habit Detail screen - shows detailed information about a habit
 */
export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabitById, incrementHabit, decrementHabit, deleteHabit, refreshHabits } = useHabits();
  const { colors } = useSettings();

  const [habit, setHabit] = useState<Habit | undefined>(() => getHabitById(id));

  // Refresh habit data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshHabits();
      setHabit(getHabitById(id));
    }, [id, getHabitById, refreshHabits])
  );

  const handleIncrement = async () => {
    if (!habit) return;
    await incrementHabit(habit.id);
    setHabit(getHabitById(id));
  };

  const handleDecrement = async () => {
    if (!habit) return;
    await decrementHabit(habit.id);
    setHabit(getHabitById(id));
  };

  const handleEdit = () => {
    if (!habit) return;
    router.push(`/edit-habit/${habit.id}`);
  };

  const handleDelete = () => {
    if (!habit) return;

    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!habit) {
    return (
      <>
        <Stack.Screen options={{ title: 'Habit' }} />
        <EmptyState
          emoji="🔍"
          title="Habit not found"
          subtitle="This habit may have been deleted"
        />
      </>
    );
  }

  const isCompleted = isHabitCompletedToday(habit);
  const weeklyHistory = getLast7DaysHistory(habit);

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={[styles.editIcon, { color: colors.primary }]}>✏️</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with emoji and progress */}
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>

            {/* Today's Progress */}
            <View style={styles.progressContainer}>
              <Text
                style={[
                  styles.progressText,
                  { color: isCompleted ? colors.success : colors.text },
                ]}
              >
                {habit.todayCount} / {habit.targetPerDay}
              </Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                {isCompleted ? 'Completed today!' : 'Today\'s progress'}
              </Text>
            </View>

            {/* Increment/Decrement buttons */}
            <View style={styles.actionButtons}>
              {habit.todayCount > 0 && (
                <TouchableOpacity
                  style={[styles.decrementBtn, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={handleDecrement}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.btnText, { color: colors.text }]}>−</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.incrementBtn,
                  { backgroundColor: isCompleted ? colors.success : colors.primary },
                ]}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <Text style={styles.incrementBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              label="Current Streak"
              value={habit.streak}
              emoji="🔥"
            />
            <StatCard
              label="Total Completions"
              value={habit.totalCompletions}
              emoji="✅"
            />
          </View>

          {/* Weekly History */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <WeeklyHistory history={weeklyHistory} targetPerDay={habit.targetPerDay} />
          </View>

          {/* Delete Button */}
          <View style={styles.deleteSection}>
            <Button
              title="Delete Habit"
              variant="danger"
              onPress={handleDelete}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressText: {
    fontSize: 48,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  incrementBtn: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementBtnText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  decrementBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 24,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  deleteSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  editButton: {
    padding: Spacing.sm,
  },
  editIcon: {
    fontSize: FontSize.lg,
  },
});
