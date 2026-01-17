// import React, { createContext, useState, useEffect, useMemo } from 'react';

// export const CurrencyContext = createContext();

// export function CurrencyProvider({ children }) {
//   const [currentCurrency, setCurrentCurrency] = useState('USD');
//   const [exchangeRates, setExchangeRates] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch rates
//   const fetchRates = async () => {
//     try {
//       const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
//       const data = await response.json();
//       setExchangeRates(data.rates);
//     } catch (error) {
//       console.error('Rates fetch failed:', error);
//       setExchangeRates({ USD: 1 });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Detect currency
//   const detectCurrency = async () => {
//     let detected = 'USD';
//     const locale = navigator.language || 'en-US';
//     const localeMap = {
//       'en-US': 'USD',
//       'en-GB': 'GBP',
//       'en-CA': 'CAD',
//       'es-ES': 'EUR',
//       'en-NG': 'NGN',
//       'en-ZA': 'ZAR',
//     };
//     detected = localeMap[locale] || 'USD';

//     // IP fallback
//     try {
//       const ipResponse = await fetch('https://ipapi.co/json/');
//       const ipData = await ipResponse.json();
//       const countryMap = {
//         'US': 'USD',
//         'GB': 'GBP',
//         'CA': 'CAD',
//         'ES': 'EUR',
//         'NG': 'NGN',
//         'ZA': 'ZAR',
//       };
//       detected = countryMap[ipData.country_code] || detected;
//     } catch (error) {
//       console.warn('IP detection failed');
//     }

//     setCurrentCurrency(detected);
//     await fetchRates();
//   };

//   const getConvertedPrice = useMemo(() => (usdPrice) => {
//     if (isLoading) return usdPrice.toFixed(2);
//     const rate = exchangeRates[currentCurrency] || 1;
//     return (usdPrice * rate).toFixed(2);
//   }, [exchangeRates, currentCurrency, isLoading]);

//   const getSymbol = useMemo(() => (currency) => {
//     const symbols = { USD: '$', GBP: '£', EUR: '€', CAD: 'C$', NGN: '₦', ZAR: 'R' };
//     return symbols[currency] || currency;
//   }, []);

//   const handleCurrencyChange = (newCurrency) => {
//     setCurrentCurrency(newCurrency);
//   };

//   useEffect(() => {
//     detectCurrency();
//   }, []);

//   const value = {
//     currentCurrency,
//     exchangeRates,
//     getConvertedPrice,
//     getSymbol,
//     handleCurrencyChange,
//     isLoading,
//   };

//   return (
//     <CurrencyContext.Provider value={value}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// }

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { fetchWithAuth } from '../api'; // Your API helper for /users/me

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userCountry, setUserCountry] = useState(null); // New: Track user country

  // Country-to-currency map (expand as needed)
  const countryToCurrency = {
    'US': 'USD',
    'NG': 'NGN',
    'GB': 'GBP',
    'CA': 'CAD',
    'ZA': 'ZAR',
    'ES': 'EUR',
    'FR': 'EUR',
    // Add more: 'IN': 'INR', etc.
  };

  // Fetch exchange rates
  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Rates fetch failed:', error);
      setExchangeRates({ USD: 1 });
    }
  };

  // Fetch user profile and update currency based on country
  const fetchUserAndUpdateCurrency = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // No user logged in

    try {
      const user = await fetchWithAuth('/users/me');
      const country = user.country; // From backend (e.g., 'NG')
      setUserCountry(country);

      if (country && countryToCurrency[country]) {
        const newCurrency = countryToCurrency[country];
        setCurrentCurrency(newCurrency);
        console.log(`Currency updated to ${newCurrency} based on country: ${country}`);
        return; // Use user country
      }
    } catch (error) {
      console.warn('Failed to fetch user for currency:', error);
      // Fall through to IP/locale
    }

    // Fallback: Detect via locale/IP
    let detected = 'USD';
    const locale = navigator.language || 'en-US';
    const localeMap = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-CA': 'CAD',
      'es-ES': 'EUR',
      'en-NG': 'NGN',
      'en-ZA': 'ZAR',
    };
    detected = localeMap[locale] || 'USD';

    // IP fallback
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      const countryMap = {
        'US': 'USD',
        'GB': 'GBP',
        'CA': 'CAD',
        'ES': 'EUR',
        'NG': 'NGN',
        'ZA': 'ZAR',
      };
      const ipCurrency = countryMap[ipData.country_code] || detected;
      setCurrentCurrency(ipCurrency);
      console.log(`Currency fallback to ${ipCurrency} via IP/country: ${ipData.country_code}`);
    } catch (error) {
      console.warn('IP detection failed, using locale:', detected);
      setCurrentCurrency(detected);
    }
  };

  const getConvertedPrice = useMemo(() => (usdPrice) => {
    if (isLoading) return usdPrice.toFixed(2);
    const rate = exchangeRates[currentCurrency] || 1;
    return (usdPrice * rate).toFixed(2);
  }, [exchangeRates, currentCurrency, isLoading]);

  const getSymbol = useMemo(() => (currency) => {
    const symbols = { 
      USD: '$', 
      GBP: '£', 
      EUR: '€', 
      CAD: 'C$', 
      NGN: '₦', 
      ZAR: 'R' 
    };
    return symbols[currency] || currency;
  }, []);

  const handleCurrencyChange = (newCurrency) => {
    setCurrentCurrency(newCurrency);
  };

  // Initial load: Fetch user/currency
  useEffect(() => {
    const initCurrency = async () => {
      setIsLoading(true);
      await fetchUserAndUpdateCurrency(); // Prioritizes user country
      await fetchRates(); // Then rates
      setIsLoading(false);
    };
    initCurrency();
  }, []);

  // Listen for login/logout (re-run detection if token changes)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !userCountry) {
      fetchUserAndUpdateCurrency(); // Re-sync on token presence
    }
  }, []); // Run once on mount; token changes trigger via localStorage events if needed

  const value = {
    currentCurrency,
    exchangeRates,
    getConvertedPrice,
    getSymbol,
    handleCurrencyChange,
    isLoading,
    userCountry, // Expose for debugging
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}