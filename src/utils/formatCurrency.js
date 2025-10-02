export const formatINR = (value) => {
  if (value === null || value === undefined) return '';

  // Coerce values like "₹1,000" or "$1,000" to a number if possible
  const numericValue = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^\d.-]/g, ''));

  if (Number.isNaN(numericValue)) {
    // If it's a non-numeric string (e.g., a range like "₹50 - ₹500"), return as-is
    return String(value);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numericValue);
}; 