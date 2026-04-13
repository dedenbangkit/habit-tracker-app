import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayRecord } from '../types';
import { useSettings } from '../context';
import { getDayOfWeekShort, isToday } from '../utils';
import { BorderRadius, Spacing, FontSize } from '../constants';

interface WeeklyHistoryProps {
  history: DayRecord[];
  targetPerDay: number;
}

export function WeeklyHistory({ history, targetPerDay }: WeeklyHistoryProps) {
  const { colors } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Last 7 Days</Text>
      <View style={styles.daysRow}>
        {history.map((record) => {
          const isTodayRecord = isToday(record.date);
          const percentage = Math.min((record.count / targetPerDay) * 100, 100);

          return (
            <View key={record.date} style={styles.dayContainer}>
              <View
                style={[
                  styles.dayCircle,
                  {
                    backgroundColor: record.completed
                      ? colors.success
                      : colors.surfaceSecondary,
                    borderColor: isTodayRecord ? colors.primary : 'transparent',
                    borderWidth: isTodayRecord ? 2 : 0,
                  },
                ]}
              >
                {record.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : record.count > 0 ? (
                  <Text style={[styles.partialCount, { color: colors.text }]}>
                    {record.count}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isTodayRecord ? colors.primary : colors.textSecondary,
                    fontWeight: isTodayRecord ? '600' : '400',
                  },
                ]}
              >
                {isTodayRecord ? 'Today' : getDayOfWeekShort(record.date)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  partialCount: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dayLabel: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
