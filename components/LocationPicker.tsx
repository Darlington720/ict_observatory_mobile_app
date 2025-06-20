import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MapPin, Navigation, RefreshCw } from 'lucide-react-native';
import Button from './Button';
import { colors } from '@/constants/Colors';
import { getCurrentLocation, LocationCoords, formatCoordinates } from '@/utils/location';

interface LocationPickerProps {
  location: LocationCoords;
  onLocationChange: (location: LocationCoords) => void;
  title?: string;
  showCoordinates?: boolean;
  disabled?: boolean;
}

export default function LocationPicker({
  location,
  onLocationChange,
  title = "GPS Location",
  showCoordinates = true,
  disabled = false
}: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    try {
      const result = await getCurrentLocation();
      
      if (result.success && result.coords) {
        onLocationChange(result.coords);
        Alert.alert(
          'Location Updated',
          `New coordinates: ${formatCoordinates(result.coords)}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Location Error',
          result.error?.message || 'Failed to get current location',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'An unexpected error occurred while getting your location.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isLocationSet = location.latitude !== 0 || location.longitude !== 0;

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.header}>
        <MapPin size={18} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showCoordinates && (
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Latitude:</Text>
            <Text style={[styles.coordinateValue, !isLocationSet && styles.noLocation]}>
              {isLocationSet ? location.latitude.toFixed(6) : 'Not set'}
            </Text>
          </View>
          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Longitude:</Text>
            <Text style={[styles.coordinateValue, !isLocationSet && styles.noLocation]}>
              {isLocationSet ? location.longitude.toFixed(6) : 'Not set'}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, isLocationSet ? styles.statusSet : styles.statusNotSet]}>
          <Navigation size={12} color={isLocationSet ? colors.success : colors.textSecondary} />
        </View>
        <Text style={[styles.statusText, isLocationSet ? styles.statusSetText : styles.statusNotSetText]}>
          {isLocationSet ? 'Location recorded' : 'No location recorded'}
        </Text>
      </View>

      <Button
        title={isLocationSet ? "Update Location" : "Get Current Location"}
        onPress={handleGetCurrentLocation}
        loading={isLoading}
        disabled={disabled}
        variant="outline"
        icon={<RefreshCw size={16} color={disabled ? colors.disabled : colors.primary} />}
        style={styles.button}
      />

      {!isLocationSet && (
        <Text style={styles.helpText}>
          Tap the button above to automatically detect and record your current GPS coordinates.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  coordinatesContainer: {
    marginBottom: 12,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  coordinateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  coordinateValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  noLocation: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: undefined,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSet: {
    backgroundColor: `${colors.success}20`,
  },
  statusNotSet: {
    backgroundColor: `${colors.textSecondary}20`,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusSetText: {
    color: colors.success,
  },
  statusNotSetText: {
    color: colors.textSecondary,
  },
  button: {
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});