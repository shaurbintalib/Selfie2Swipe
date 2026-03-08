import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../types';
import { COLORS } from '../constants/colors';

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  onToggle: (theme: Theme) => void;
  disabled: boolean;
}

export default function ThemeCard({ theme, selected, onToggle, disabled }: ThemeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onToggle(theme)}
      disabled={disabled && !selected}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={theme.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.icon}>{theme.icon}</Text>
        {selected && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </LinearGradient>
      <Text style={[styles.name, disabled && !selected && styles.nameDisabled]}>
        {theme.name}
      </Text>
      <Text style={[styles.description, disabled && !selected && styles.nameDisabled]}>
        {theme.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardSelected: {
    transform: [{ scale: 1.02 }],
  },
  gradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 32,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  nameDisabled: {
    opacity: 0.4,
  },
});
