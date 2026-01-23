import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface LocationContextType {
  location: LocationState | null;
  setLocation: (location: LocationState | null) => void;
  clearLocation: () => void;
  hasLocation: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationState | null>(null);

  const setLocation = useCallback((newLocation: LocationState | null) => {
    setLocationState(newLocation);
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
  }, []);

  const hasLocation = location !== null;

  return (
    <LocationContext.Provider value={{ location, setLocation, clearLocation, hasLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
