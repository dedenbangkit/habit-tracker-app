import React, { useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabits, useSettings } from '../context';
import { HabitCard, EmptyState, FloatingActionButton } from '../components';
import { Spacing, FontSize } from '../constants';

/**
 * Home screen - displays list of habits
 */
export default function HomeScreen() {
  const router = useRouter();
  const { habits, isLoading, incrementHabit, decrementHabit, refreshHabits } = useHabits();
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  // Refresh habits when screen comes into focus (handles date change)
  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [refreshHabits])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshHabits();
    setRefreshing(false);
  }, [refreshHabits]);

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const handleAddHabit = () => {
    router.push('/add-habit');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Habit Counter',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSettings}
              style={styles.settingsButton}
            >
              <Text style={[styles.settingsIcon, { color: colors.text }]}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {habits.length === 0 && !isLoading ? (
          <EmptyState
            emoji="✨"
            title="No habits yet"
            subtitle="Tap the + button to create your first habit and start tracking your progress"
          />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { paddingBottom: 80 + insets.bottom }]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onPress={() => handleHabitPress(habit.id)}
                onIncrement={() => incrementHabit(habit.id)}
                onDecrement={() => decrementHabit(habit.id)}
              />
            ))}
          </ScrollView>
        )}
        <FloatingActionButton onPress={handleAddHabit} />
      </View>
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
  settingsButton: {
    padding: Spacing.sm,
  },
  settingsIcon: {
    fontSize: FontSize.xl,
  },
});
