// services/googleMapsService.js

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const getGoogleGeocode = async (address) => {
  try {
    const fullAddress = `${address.address}, ${address.city}, ${address.province} ${address.postalCode}, South Africa`;
  

    const response = await client.geocode({
      params: {
        address: fullAddress,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });


    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.warn('No results found for the given address in Google Geocoding');
      return null;
    }
  } catch (error) {
    console.error('Google Geocoding error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return null;
  }
};