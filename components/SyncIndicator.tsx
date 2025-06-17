import { colors } from '@/constants/Colors';
import { Check, Clock, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SyncIndicatorProps = {
  status: 'synced' | 'pending' | 'failed';
  size?: 'small' | 'medium' | 'large';
};

export default function SyncIndicator({ status, size = 'medium' }: SyncIndicatorProps) {
  const iconSize = size === 'small' ? 14 : size === 'medium' ? 18 : 24;
  
  return (
    <View style={styles.container}>
      {status === 'synced' && (
        <View style={[styles.indicator, styles.synced]}>
          <Check size={iconSize} color={colors.success} />
        </View>
      )}
      
      {status === 'pending' && (
        <View style={[styles.indicator, styles.pending]}>
          <Clock size={iconSize} color={colors.pending} />
        </View>
      )}
      
      {status === 'failed' && (
        <View style={[styles.indicator, styles.failed]}>
          <X size={iconSize} color={colors.error} />
        </View>
      )}
      
      {size !== 'small' && (
        <Text style={[
          styles.text,
          status === 'synced' && styles.syncedText,
          status === 'pending' && styles.pendingText,
          status === 'failed' && styles.failedText,
        ]}>
          {status === 'synced' ? 'Synced' : status === 'pending' ? 'Pending' : 'Failed'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    borderRadius: 12,
    padding: 2,
  },
  synced: {
    backgroundColor: `${colors.success}20`,
  },
  pending: {
    backgroundColor: `${colors.pending}20`,
  },
  failed: {
    backgroundColor: `${colors.error}20`,
  },
  text: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  syncedText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.pending,
  },
  failedText: {
    color: colors.error,
  },
});