// services/fallbackGeocodingService.js

import axios from 'axios';

export const getFallbackGeocode = async (address) => {
  try {
    const fullAddress = `${address.address}, ${address.city}, ${address.province} ${address.postalCode}, South Africa`;
    console.log('Requesting fallback geocode for address:', fullAddress);

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: fullAddress,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'YourAppName/1.0' // Replace with your app name
      }
    });

    console.log('Fallback Geocoding API full response:', JSON.stringify(response.data, null, 2));

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      console.warn('No results found for the given address in fallback geocoding');
      return null;
    }
  } catch (error) {
    console.error('Fallback Geocoding error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return null;
  }
};