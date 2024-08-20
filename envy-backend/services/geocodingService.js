// services/geocodingService.js

import { getGoogleGeocode } from './googleMapsService.js';
import { getFallbackGeocode } from './fallbackGeocodingService.js';

export const getGeocode = async (address) => {
  // Try Google Maps geocoding first
  const googleResult = await getGoogleGeocode(address);
  if (googleResult) return googleResult;

  // If Google fails, try the fallback service
  console.log('Google geocoding failed, trying fallback service...');
  return getFallbackGeocode(address);
};