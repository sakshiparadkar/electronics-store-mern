// src/utils/currency.js
export const usdToInr = usd => {
  if (typeof usd !== 'number') return '₹0';
  const rate = 83; // approx USD → INR
  return `₹${(usd * rate).toFixed(2)}`;
};
