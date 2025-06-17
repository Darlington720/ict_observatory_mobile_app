import { colors } from '@/constants/Colors';
import { Wifi, WifiOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Mock network status for demo purposes
// In a real app, use react-native-netinfo
export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    // Simulate network changes
    const interval = setInterval(() => {
      // 80% chance of being connected
      setIsConnected(Math.random() > 0.2);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (isConnected) {
    return (
      <View style={[styles.container, styles.connected]}>
        <Wifi size={16} color={colors.success} />
        <Text style={styles.connectedText}>Online</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, styles.disconnected]}>
      <WifiOff size={16} color={colors.error} />
      <Text style={styles.disconnectedText}>Offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  connected: {
    backgroundColor: `${colors.success}15`,
  },
  disconnected: {
    backgroundColor: `${colors.error}15`,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
  },
  disconnectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
  },
});