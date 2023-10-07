import React, { createContext, useEffect, useState } from 'react';

export const SignedInContext = createContext();

export const SignedInProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const storedSignedIn = localStorage.getItem('signedIn');
    if (storedSignedIn) {
      setSignedIn(JSON.parse(storedSignedIn));
    }
  }, []);

  const handleSignIn = (value) => {
    setSignedIn(value);
    localStorage.setItem('signedIn', JSON.stringify(value));
  };

  return (
    <SignedInContext.Provider value={{ signedIn, handleSignIn }}>
      {children}
    </SignedInContext.Provider>
  );
};
