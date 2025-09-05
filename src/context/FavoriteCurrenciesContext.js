import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteCurrenciesContext = createContext();

export const FavoriteCurrenciesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('favoriteCurrencies');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteCurrencies', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (currency) => {
    setFavorites((prev) => prev.includes(currency) ? prev : [...prev, currency]);
  };

  const removeFavorite = (currency) => {
    setFavorites((prev) => prev.filter((item) => item !== currency));
  };

  const isFavorite = (currency) => favorites.includes(currency);

  return (
    <FavoriteCurrenciesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteCurrenciesContext.Provider>
  );
};

export const useFavoriteCurrencies = () => useContext(FavoriteCurrenciesContext);
