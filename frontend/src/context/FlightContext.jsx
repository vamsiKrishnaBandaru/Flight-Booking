import React, { createContext, useState, useContext, useEffect } from 'react';

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState(() => {
    const savedFlight = sessionStorage.getItem('selectedFlight');
    return savedFlight ? JSON.parse(savedFlight) : null;
  });

  const [postAuthPath, setPostAuthPath] = useState(sessionStorage.getItem('postAuthPath') || '/');

  useEffect(() => {
    if (selectedFlight) {
      sessionStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    } else {
      sessionStorage.removeItem('selectedFlight');
    }
  }, [selectedFlight]);

  useEffect(() => {
    if (postAuthPath) {
      sessionStorage.setItem('postAuthPath', postAuthPath);
    } else {
      sessionStorage.removeItem('postAuthPath');
    }
  }, [postAuthPath]);

  const value = {
    selectedFlight,
    setSelectedFlight,
    postAuthPath,
    setPostAuthPath,
    clearFlightContext: () => {
      setSelectedFlight(null);
      setPostAuthPath('/');
    }
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
}; 