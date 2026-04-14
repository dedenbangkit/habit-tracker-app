import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabits, useSettings } from '../../context';
import { Button, Input, EmojiPicker, EmptyState } from '../../components';
import { Spacing } from '../../constants';

/**
 * Edit Habit screen - form to update an existing habit
 */
export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabitById, updateHabit } = useHabits();
  const { colors } = useSettings();

  const habit = getHabitById(id);
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(habit?.name || '');
  const [emoji, setEmoji] = useState(habit?.emoji || '🎯');
  const [targetPerDay, setTargetPerDay] = useState(
    habit?.targetPerDay?.toString() || '1'
  );
  const [errors, setErrors] = useState<{ name?: string; target?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state if habit changes
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setEmoji(habit.emoji);
      setTargetPerDay(habit.targetPerDay.toString());
    }
  }, [habit]);

  if (!habit) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit Habit' }} />
        <EmptyState
          emoji="🔍"
          title="Habit not found"
          subtitle="This habit may have been deleted"
        />
      </>
    );
  }

  const validate = (): boolean => {
    const newErrors: { name?: string; target?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }

    const target = parseInt(targetPerDay, 10);
    if (isNaN(target) || target < 1) {
      newErrors.target = 'Target must be at least 1';
    } else if (target > 100) {
      newErrors.target = 'Target must be 100 or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updateHabit(habit.id, {
        name: name.trim(),
        emoji,
        targetPerDay: parseInt(targetPerDay, 10),
      });
      router.back();
    } catch (error) {
      console.error('Error updating habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Habit',
        }}
      />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Input
              label="Habit Name"
              placeholder="e.g., Drink water, Exercise, Read"
              value={name}
              onChangeText={setName}
              error={errors.name}
              maxLength={50}
            />

            <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />

            <Input
              label="Daily Target"
              placeholder="1"
              value={targetPerDay}
              onChangeText={setTargetPerDay}
              error={errors.target}
              keyboardType="number-pad"
              maxLength={3}
            />
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: Spacing.xl + insets.bottom }]}>
            <Button
              title="Save Changes"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  footer: {
    padding: Spacing.lg,
  },
});
