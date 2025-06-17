import { colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
};

export default function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View 
      style={[
        styles.card, 
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});