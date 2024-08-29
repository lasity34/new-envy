import express from 'express';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';
import { 
  getShippingRates, 
  validateAddress, 
  shipmentWebhook, 
  getTrackingInfo, 
  cancelShipment, 
  getShipmentLabel,
  createShipment
} from '../controllers/shippingcontroller.js';

const router = express.Router();

router.post('/rates', authenticate, getShippingRates);
router.post('/validate-address', authenticate, validateAddress);
router.post('/shipment-webhook', shipmentWebhook);
router.get('/tracking/:trackingNumber', authenticate, getTrackingInfo);
router.post('/cancel-shipment/:trackingNumber', authenticateAdmin, cancelShipment);
router.get('/shipment-label/:trackingNumber', authenticateAdmin, getShipmentLabel);
router.post('/create-shipment', authenticate, createShipment);

export default router;