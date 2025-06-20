import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface LocationResult {
  success: boolean;
  coords?: LocationCoords;
  error?: LocationError;
}

/**
 * Request location permissions from the user
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

/**
 * Check if location permissions are already granted
 */
export async function hasLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
}

/**
 * Get the current location with high accuracy
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  try {
    // Check if location services are enabled
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      return {
        success: false,
        error: {
          code: 'LOCATION_DISABLED',
          message: 'Location services are disabled. Please enable location services in your device settings.'
        }
      };
    }

    // Request permission if not already granted
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        return {
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: 'Location permission is required to record accurate school coordinates.'
          }
        };
      }
    }

    let location: Location.LocationObject;

    if (Platform.OS === 'web') {
      // For web, use the browser's geolocation API with a promise wrapper
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve({
            success: false,
            error: {
              code: 'NOT_SUPPORTED',
              message: 'Geolocation is not supported by this browser.'
            }
          });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              success: true,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }
            });
          },
          (error) => {
            let errorMessage = 'Failed to get location.';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out.';
                break;
            }
            resolve({
              success: false,
              error: {
                code: 'GEOLOCATION_ERROR',
                message: errorMessage
              }
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          }
        );
      });
    } else {
      // For native platforms, use Expo Location
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      });

      return {
        success: true,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      };
    }
  } catch (error: any) {
    console.error('Error getting current location:', error);
    
    let errorMessage = 'Failed to get current location.';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
      errorMessage = 'Location services are disabled. Please enable them in your device settings.';
      errorCode = 'LOCATION_DISABLED';
    } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
      errorMessage = 'Location is currently unavailable. Please try again.';
      errorCode = 'LOCATION_UNAVAILABLE';
    } else if (error.code === 'E_LOCATION_TIMEOUT') {
      errorMessage = 'Location request timed out. Please try again.';
      errorCode = 'TIMEOUT';
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
}

/**
 * Watch location changes (for continuous tracking)
 */
export async function watchLocation(
  callback: (result: LocationResult) => void,
  options?: {
    accuracy?: Location.Accuracy;
    timeInterval?: number;
    distanceInterval?: number;
  }
): Promise<{ remove: () => void } | null> {
  try {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        callback({
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: 'Location permission is required for location tracking.'
          }
        });
        return null;
      }
    }

    if (Platform.OS === 'web') {
      // Web implementation for watching location
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            success: true,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          });
        },
        (error) => {
          callback({
            success: false,
            error: {
              code: 'WATCH_ERROR',
              message: 'Error watching location changes.'
            }
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

      return {
        remove: () => navigator.geolocation.clearWatch(watchId)
      };
    } else {
      // Native implementation
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.High,
          timeInterval: options?.timeInterval || 5000,
          distanceInterval: options?.distanceInterval || 10,
        },
        (location) => {
          callback({
            success: true,
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          });
        }
      );

      return {
        remove: () => subscription.remove()
      };
    }
  } catch (error) {
    console.error('Error setting up location watch:', error);
    callback({
      success: false,
      error: {
        code: 'WATCH_SETUP_ERROR',
        message: 'Failed to set up location tracking.'
      }
    });
    return null;
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: LocationCoords, precision: number = 6): string {
  return `${coords.latitude.toFixed(precision)}, ${coords.longitude.toFixed(precision)}`;
}

/**
 * Calculate distance between two coordinates (in kilometers)
 */
export function calculateDistance(coord1: LocationCoords, coord2: LocationCoords): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}