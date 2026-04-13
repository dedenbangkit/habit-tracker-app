import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useSettings } from '../context';
import { BorderRadius, Spacing, FontSize } from '../constants';

interface SettingsRowProps {
  label: string;
  description?: string;
  type: 'toggle' | 'button' | 'info';
  value?: boolean;
  infoValue?: string;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

export function SettingsRow({
  label,
  description,
  type,
  value,
  infoValue,
  onToggle,
  onPress,
  danger = false,
}: SettingsRowProps) {
  const { colors } = useSettings();

  const content = (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: danger ? colors.error : colors.text },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>

      {type === 'toggle' && onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.surfaceSecondary, true: colors.primaryLight }}
          thumbColor={value ? colors.primary : colors.textTertiary}
        />
      )}

      {type === 'info' && infoValue && (
        <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
          {infoValue}
        </Text>
      )}

      {type === 'button' && (
        <Text style={[styles.arrow, { color: colors.textTertiary }]}>›</Text>
      )}
    </View>
  );

  if (type === 'button' && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  description: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSize.md,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
