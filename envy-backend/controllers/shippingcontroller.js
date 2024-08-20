// controllers/shippingController.js

import axios from 'axios';
import { getGeocode } from '../services/geocodingService.js';
import { pool } from '../db/database.js';

const shipLogicApi = axios.create({
  baseURL: 'https://api.shiplogic.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.SHIPLOGIC_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

function calculateTotalDimensions(cartItems) {
  // Default values
  const defaultDimensions = {
    length: 10,  // 10 cm
    width: 10,   // 10 cm
    height: 10,  // 10 cm
    weight: 0.5  // 0.5 kg
  };

  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  cartItems.forEach(item => {
    const itemWeight = item.weight || defaultDimensions.weight;
    const itemLength = item.length || defaultDimensions.length;
    const itemWidth = item.width || defaultDimensions.width;
    const itemHeight = item.height || defaultDimensions.height;

    totalWeight += itemWeight * item.quantity;
    maxLength = Math.max(maxLength, itemLength);
    maxWidth = Math.max(maxWidth, itemWidth);
    totalHeight += itemHeight * item.quantity;
  });

  return {
    totalLength: Math.max(maxLength, 1),  // minimum 1 cm
    totalWidth: Math.max(maxWidth, 1),    // minimum 1 cm
    totalHeight: Math.max(totalHeight, 1), // minimum 1 cm
    totalWeight: Math.max(totalWeight, 0.1) // minimum 0.1 kg
  };
}

export const getShippingRates = async (req, res) => {
  try {
    const { cartItems, deliveryAddress } = req.body;

   

    // Get geocode for delivery address
    const deliveryGeocode = await getGeocode(deliveryAddress);

    if (!deliveryGeocode) {
      return res.status(400).json({ error: 'Unable to determine location from the provided address. Please check your address details.' });
    }

    // Use default values if dimensions are not provided
    const { totalLength, totalWidth, totalHeight, totalWeight } = calculateTotalDimensions(cartItems);

    const rateRequest = {
      collection_address: {
        type: "business",
        company: process.env.COMPANY_NAME,
        street_address: process.env.WAREHOUSE_ADDRESS,
        local_area: process.env.WAREHOUSE_AREA,
        city: process.env.WAREHOUSE_CITY,
        zone: process.env.WAREHOUSE_PROVINCE,
        country: "ZA",
        code: process.env.WAREHOUSE_POSTAL_CODE,
        lat: parseFloat(process.env.WAREHOUSE_LAT),
        lng: parseFloat(process.env.WAREHOUSE_LNG)
      },
      delivery_address: {
        type: "residential",
        company: "",
        street_address: deliveryAddress.address,
        local_area: deliveryAddress.area || "",
        city: deliveryAddress.city,
        zone: deliveryAddress.province,
        country: "ZA",
        code: deliveryAddress.postalCode,
        lat: deliveryGeocode.lat,
        lng: deliveryGeocode.lng
      },
      parcels: [
        {
          submitted_length_cm: totalLength,
          submitted_width_cm: totalWidth,
          submitted_height_cm: totalHeight,
          submitted_weight_kg: totalWeight
        }
      ],
      declared_value: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      collection_min_date: new Date().toISOString().split('T')[0],
      delivery_min_date: new Date().toISOString().split('T')[0]
    };

    const response = await shipLogicApi.post('/rates', rateRequest);
    
    

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    res.status(500).json({ error: 'Failed to fetch shipping rates', details: error.message });
  }
};

export const createShipment = async (userData, cartItems, selectedShipping) => {
  try {
    const { totalLength, totalWidth, totalHeight, totalWeight } = calculateTotalDimensions(cartItems);
   
    // Get geocode for delivery address
    const deliveryGeocode = await getGeocode(userData);
   
    if (!deliveryGeocode) {
      throw new Error('Unable to determine location from the provided address');
    }
   
    // Create ISO 8601 date strings for collection and delivery
    const currentDate = new Date().toISOString().split('T')[0];
    const collectionDate = `${currentDate}T00:00:00.000Z`;
    const deliveryDate = `${currentDate}T00:00:00.000Z`;

    // Calculate the declared value
    const declaredValue = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const shipmentRequest = {
      collection_address: {
        type: "business",
        company: process.env.COMPANY_NAME,
        street_address: process.env.WAREHOUSE_ADDRESS,
        local_area: process.env.WAREHOUSE_AREA,
        city: process.env.WAREHOUSE_CITY,
        zone: process.env.WAREHOUSE_PROVINCE,
        country: "ZA",
        code: process.env.WAREHOUSE_POSTAL_CODE,
        lat: parseFloat(process.env.WAREHOUSE_LAT),
        lng: parseFloat(process.env.WAREHOUSE_LNG)
      },
      collection_contact: {
        name: process.env.COLLECTION_CONTACT_NAME,
        mobile_number: process.env.COLLECTION_CONTACT_MOBILE,
        email: process.env.COLLECTION_CONTACT_EMAIL
      },
      delivery_address: {
        type: "residential",
        company: "",
        street_address: userData.address,
        local_area: userData.area || "",
        city: userData.city,
        zone: userData.province,
        country: "ZA",
        code: userData.postal_code,
        lat: deliveryGeocode.lat,
        lng: deliveryGeocode.lng
      },
      delivery_contact: {
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        mobile_number: userData.phone,
        email: userData.email
      },
      parcels: [
        {
          parcel_description: "Envy Cap Order",
          submitted_length_cm: totalLength,
          submitted_width_cm: totalWidth,
          submitted_height_cm: totalHeight,
          submitted_weight_kg: totalWeight
        }
      ],
      special_instructions_collection: "Please handle with care",
      special_instructions_delivery: "Please handle with care",
      declared_value: declaredValue,
      collection_min_date: collectionDate,
      collection_after: "08:00",
      collection_before: "16:00",
      delivery_min_date: deliveryDate,
      delivery_after: "10:00",
      delivery_before: "17:00",
      customer_reference: `ORDER-${Date.now()}`,
      service_level_code: selectedShipping.service_level.code,
      courier: selectedShipping.courier_id,
      mute_notifications: false
    };


    const shipmentResponse = await shipLogicApi.post('/shipments', shipmentRequest);
   
   

    return {
      tracking_reference: shipmentResponse.data.tracking_reference,
      ...shipmentResponse.data
    };
  } catch (error) {
    console.error('Error creating shipment:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    throw error;
  }
};


// Add this function to validate the shipping options before creating a shipment
export const validateShippingOptions = async (userData, cartItems, selectedShipping) => {
  try {
    const { totalLength, totalWidth, totalHeight, totalWeight } = calculateTotalDimensions(cartItems);
    
    const deliveryGeocode = await getGeocode(userData);
    
    if (!deliveryGeocode) {
      throw new Error('Unable to determine location from the provided address');
    }

    const declaredValue = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const rateRequest = {
      collection_address: {
        type: "business",
        company: process.env.COMPANY_NAME,
        street_address: process.env.WAREHOUSE_ADDRESS,
        local_area: process.env.WAREHOUSE_AREA,
        city: process.env.WAREHOUSE_CITY,
        zone: process.env.WAREHOUSE_PROVINCE,
        country: "ZA",
        code: process.env.WAREHOUSE_POSTAL_CODE,
        lat: parseFloat(process.env.WAREHOUSE_LAT),
        lng: parseFloat(process.env.WAREHOUSE_LNG)
      },
      delivery_address: {
        type: "residential",
        company: "",
        street_address: userData.address,
        local_area: userData.area || "",
        city: userData.city,
        zone: userData.province,
        country: "ZA",
        code: userData.postalCode,
        lat: deliveryGeocode.lat,
        lng: deliveryGeocode.lng
      },
      parcels: [
        {
          submitted_length_cm: totalLength,
          submitted_width_cm: totalWidth,
          submitted_height_cm: totalHeight,
          submitted_weight_kg: totalWeight
        }
      ],
      declared_value: declaredValue,
    };

    const response = await shipLogicApi.post('/rates', rateRequest);
    
    const availableRates = response.data.rates;
    const selectedRate = availableRates.find(rate => 
      rate.service_level.id === selectedShipping.service_level.id &&
      rate.courier_id === selectedShipping.courier_id
    );

    if (!selectedRate) {
      throw new Error('Selected shipping option is not available for this order');
    }

    return true;
  } catch (error) {
    console.error('Error validating shipping options:', error);
    throw error;
  }
};

export const validateAddress = async (req, res) => {
  try {
    const { address, city, province, postalCode } = req.body;

    const geocode = await getGeocode({ address, city, province, postalCode });
    
    if (geocode) {
      res.json({ isValid: true, geocode });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).json({ error: 'Failed to validate address', details: error.message });
  }
};

// In shippingController.js
export const shipmentWebhook = async (req, res) => {
  try {
    const { tracking_reference, status, estimated_delivery_date } = req.body;
    // Update the order in your database with the new status and estimated delivery date
    await updateOrderShipmentStatus(tracking_reference, status, estimated_delivery_date);
    res.status(200).send('Webhook received successfully');
  } catch (error) {
    console.error('Error processing shipment webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

export const getTrackingInfo = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const trackingInfo = await shipLogicApi.get(`/tracking/${trackingNumber}`);
    res.json(trackingInfo.data);
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ error: 'Failed to fetch tracking information' });
  }
};

export const cancelShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    await shipLogicApi.post(`/shipments/${trackingNumber}/cancel`);
    await updateOrderStatus(trackingNumber, 'Cancelled');
    res.json({ message: 'Shipment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    res.status(500).json({ error: 'Failed to cancel shipment', details: error.message });
  }
};


export const getShipmentLabel = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const labelResponse = await shipLogicApi.get(`/shipments/${trackingNumber}/label`, { responseType: 'arraybuffer' });
    res.contentType('application/pdf');
    res.send(labelResponse.data);
  } catch (error) {
    console.error('Error fetching shipment label:', error);
    res.status(500).json({ error: 'Failed to fetch shipment label' });
  }
};


const updateOrderShipmentStatus = async (trackingNumber, status, estimatedDeliveryDate) => {
  try {
    await pool.query(
      'UPDATE orders SET status = $1, estimated_delivery_date = $2 WHERE tracking_number = $3',
      [status, estimatedDeliveryDate, trackingNumber]
    );
  } catch (error) {
    console.error('Error updating order shipment status:', error);
    throw error;
  }
};

const updateOrderStatus = async (trackingNumber, status) => {
  try {
    await pool.query(
      'UPDATE orders SET status = $1 WHERE tracking_number = $2',
      [status, trackingNumber]
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
