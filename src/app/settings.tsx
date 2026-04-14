import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings, useHabits } from '../context';
import { SettingsRow } from '../components';
import { Spacing, FontSize, APP_VERSION } from '../constants';

/**
 * Settings screen - app preferences and data management
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleDarkMode, resetAllData } = useSettings();
  const { refreshHabits } = useHabits();
  const insets = useSafeAreaInsets();

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            await refreshHabits();
            Alert.alert('Done', 'All data has been reset.');
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: Spacing.xl + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance Section */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Appearance
          </Text>
          <SettingsRow
            label="Dark Mode"
            description="Switch between light and dark theme"
            type="toggle"
            value={isDarkMode}
            onToggle={toggleDarkMode}
          />

          {/* Data Section */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Data
          </Text>
          <SettingsRow
            label="Reset All Data"
            description="Delete all habits and progress"
            type="button"
            onPress={handleResetData}
            danger
          />

          {/* About Section */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            About
          </Text>
          <SettingsRow
            label="Version"
            type="info"
            infoValue={APP_VERSION}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              Habit Counter
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
              Your data is stored locally on this device only.
            </Text>
          </View>
        </ScrollView>
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
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
