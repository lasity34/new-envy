import axios from 'axios';

const shipLogicApi = axios.create({
  baseURL: 'https://api.shiplogic.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.SHIPLOGIC_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const getShippingRates = async (cartItems, deliveryAddress) => {
  try {
    const response = await shipLogicApi.post('/rates', {
      collection_address: {
        // Your warehouse address details
      },
      delivery_address: {
        type: "residential",
        street_address: deliveryAddress.address,
        city: deliveryAddress.city,
        zone: deliveryAddress.province,
        country: "ZA",
        code: deliveryAddress.postalCode,
      },
      parcels: cartItems.map(item => ({
        // Convert cart items to parcels
      })),
      declared_value: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    });

    return response.data.map(rate => ({
      id: rate.courier_id,
      name: rate.courier_name,
      cost: rate.total_price,
      estimated_delivery_date: rate.estimated_delivery_date,
    }));
  } catch (error) {
    console.error('Error fetching shipping rates from ShipLogic:', error);
    throw error;
  }
};