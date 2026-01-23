/**
 * Robust Geolocation Utility for Production Environments
 * Handles HTTPS requirements, permissions, timeouts, and errors
 */

export interface GeolocationResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  error?: string;
  errorCode?: 'NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'HTTPS_REQUIRED' | 'UNKNOWN';
}

export interface GeolocationOptions {
  timeout?: number; // milliseconds
  maximumAge?: number; // milliseconds
  enableHighAccuracy?: boolean;
  retryAttempts?: number;
  retryDelay?: number; // milliseconds
}

const DEFAULT_OPTIONS: Required<GeolocationOptions> = {
  timeout: 10000, // 10 seconds
  maximumAge: 60000, // 1 minute
  enableHighAccuracy: true,
  retryAttempts: 2,
  retryDelay: 1000, // 1 second
};

/**
 * Check if geolocation is supported and available
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator && !!navigator.geolocation;
}

/**
 * Check if the site is running on HTTPS (required for geolocation in production)
 */
export function isSecureContext(): boolean {
  // localhost and 127.0.0.1 are considered secure even on HTTP
  if (typeof window === 'undefined') return false;
  
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '[::1]';
  
  return window.isSecureContext || isLocalhost;
}

/**
 * Check geolocation permission state
 */
export async function checkGeolocationPermission(): Promise<PermissionState | 'unsupported'> {
  if (!('permissions' in navigator)) {
    return 'unsupported';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return result.state;
  } catch (error) {
    console.warn('Permission API not fully supported:', error);
    return 'unsupported';
  }
}

/**
 * Get user-friendly error message based on error code
 */
export function getGeolocationErrorMessage(errorCode: GeolocationResult['errorCode']): string {
  switch (errorCode) {
    case 'NOT_SUPPORTED':
      return 'Location services are not supported by your browser. Please use a modern browser like Chrome, Firefox, or Safari.';
    case 'PERMISSION_DENIED':
      return 'Location access was denied. Please enable location permissions in your browser settings and try again.';
    case 'POSITION_UNAVAILABLE':
      return 'Unable to determine your location. Please check your device\'s location settings and try again.';
    case 'TIMEOUT':
      return 'Location request timed out. Please check your internet connection and try again.';
    case 'HTTPS_REQUIRED':
      return 'Location services require a secure connection (HTTPS). Please ensure you\'re accessing the site via HTTPS.';
    case 'UNKNOWN':
    default:
      return 'An unexpected error occurred while getting your location. Please try again.';
  }
}

/**
 * Get detailed error information from GeolocationPositionError
 */
function getErrorDetails(error: GeolocationPositionError): Pick<GeolocationResult, 'error' | 'errorCode'> {
  let errorCode: GeolocationResult['errorCode'];
  let errorMessage: string;

  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorCode = 'PERMISSION_DENIED';
      errorMessage = 'User denied location access';
      break;
    case error.POSITION_UNAVAILABLE:
      errorCode = 'POSITION_UNAVAILABLE';
      errorMessage = 'Location information unavailable';
      break;
    case error.TIMEOUT:
      errorCode = 'TIMEOUT';
      errorMessage = 'Location request timed out';
      break;
    default:
      errorCode = 'UNKNOWN';
      errorMessage = error.message || 'Unknown error occurred';
  }

  return { error: errorMessage, errorCode };
}

/**
 * Attempt to get current position with retry logic
 */
async function attemptGetPosition(
  options: PositionOptions,
  attempt: number,
  maxAttempts: number,
  retryDelay: number
): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      async (error) => {
        const errorDetails = getErrorDetails(error);
        
        // Don't retry on permission denied
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            success: false,
            ...errorDetails,
          });
          return;
        }

        // Retry on timeout or position unavailable
        if (attempt < maxAttempts) {
          console.log(`Geolocation attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
          await new Promise(r => setTimeout(r, retryDelay));
          const result = await attemptGetPosition(options, attempt + 1, maxAttempts, retryDelay);
          resolve(result);
        } else {
          resolve({
            success: false,
            ...errorDetails,
          });
        }
      },
      options
    );
  });
}

/**
 * Get current user location with comprehensive error handling
 * 
 * @param options - Configuration options for geolocation request
 * @returns Promise with geolocation result
 * 
 * @example
 * ```typescript
 * const result = await getCurrentLocation({ timeout: 5000 });
 * if (result.success) {
 *   console.log(`Location: ${result.latitude}, ${result.longitude}`);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function getCurrentLocation(
  options: GeolocationOptions = {}
): Promise<GeolocationResult> {
  // Merge with default options
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if geolocation is supported
  if (!isGeolocationSupported()) {
    return {
      success: false,
      error: 'Geolocation is not supported',
      errorCode: 'NOT_SUPPORTED',
    };
  }

  // Check if running in secure context (HTTPS)
  if (!isSecureContext()) {
    console.warn('Geolocation requires HTTPS in production environments');
    return {
      success: false,
      error: 'HTTPS required for location services',
      errorCode: 'HTTPS_REQUIRED',
    };
  }

  // Check permission state if available
  const permissionState = await checkGeolocationPermission();
  if (permissionState === 'denied') {
    return {
      success: false,
      error: 'Location permission denied',
      errorCode: 'PERMISSION_DENIED',
    };
  }

  // Prepare position options
  const positionOptions: PositionOptions = {
    enableHighAccuracy: opts.enableHighAccuracy,
    timeout: opts.timeout,
    maximumAge: opts.maximumAge,
  };

  // Attempt to get position with retry logic
  try {
    const result = await attemptGetPosition(
      positionOptions,
      1,
      opts.retryAttempts,
      opts.retryDelay
    );
    return result;
  } catch (error) {
    console.error('Unexpected geolocation error:', error);
    return {
      success: false,
      error: 'Unexpected error occurred',
      errorCode: 'UNKNOWN',
    };
  }
}

/**
 * Watch user location with continuous updates
 * 
 * @param onSuccess - Callback for successful location updates
 * @param onError - Callback for errors
 * @param options - Configuration options
 * @returns Cleanup function to stop watching
 */
export function watchLocation(
  onSuccess: (result: GeolocationResult) => void,
  onError: (result: GeolocationResult) => void,
  options: GeolocationOptions = {}
): () => void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!isGeolocationSupported()) {
    onError({
      success: false,
      error: 'Geolocation is not supported',
      errorCode: 'NOT_SUPPORTED',
    });
    return () => {};
  }

  if (!isSecureContext()) {
    onError({
      success: false,
      error: 'HTTPS required for location services',
      errorCode: 'HTTPS_REQUIRED',
    });
    return () => {};
  }

  const positionOptions: PositionOptions = {
    enableHighAccuracy: opts.enableHighAccuracy,
    timeout: opts.timeout,
    maximumAge: opts.maximumAge,
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        success: true,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      const errorDetails = getErrorDetails(error);
      onError({
        success: false,
        ...errorDetails,
      });
    },
    positionOptions
  );

  // Return cleanup function
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
