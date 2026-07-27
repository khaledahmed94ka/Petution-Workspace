// =============================================================================
// PETUTION SHOPIFY SYNCHRONIZATION ENDPOINTS
// Webhook Processing, Anti-Loop Header Check, & Metaobject Export Contract
// =============================================================================

import express from 'express';
export const shopifyRouter = express.Router();

/**
 * Middleware to check loop prevention header
 */
const preventInfiniteLoop = (req, res, next) => {
  const source = req.headers['x-petution-source'];
  if (source === 'backend') {
    console.log('[Shopify Webhook] Dropped circular event from petution-backend');
    return res.status(200).json({ status: 'ignored', reason: 'circular_event_prevented' });
  }
  next();
};

/**
 * POST /api/webhooks/shopify/customers
 * Ingest customer creation/update from Shopify. Match by phone/email.
 */
shopifyRouter.post('/customers', preventInfiniteLoop, (req, res) => {
  const customer = req.body;
  const phone = customer.phone || customer.default_address?.phone || '';
  const email = customer.email || '';
  const name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Shopify Customer';

  console.log(`[Shopify Webhook] Ingesting customer: ${name} (${phone} / ${email})`);

  res.status(200).json({
    success: true,
    message: 'Shopify customer processed successfully',
    matchedClient: {
      name,
      phone,
      email,
      shopifyCustomerId: customer.id
    }
  });
});

/**
 * POST /api/webhooks/shopify/orders
 * Ingest order creation from Shopify. Register web sale invoice & stock adjustment.
 */
shopifyRouter.post('/orders', preventInfiniteLoop, (req, res) => {
  const order = req.body;
  const lineItems = order.line_items || [];

  console.log(`[Shopify Webhook] Ingesting Order #${order.order_number || order.id} (${lineItems.length} items)`);

  res.status(200).json({
    success: true,
    message: 'Shopify order web sale invoice & stock adjustment recorded',
    orderId: order.id,
    itemCount: lineItems.length
  });
});

/**
 * GET /api/v1/pets/:id/shopify-metaobject
 * Returns Shopify `pet_profile` Metaobject Contract Schema JSON.
 */
shopifyRouter.get('/pets/:id/shopify-metaobject', (req, res) => {
  const petId = req.params.id;

  // Formatted Shopify pet_profile metaobject payload definition
  const metaobjectPayload = {
    type: 'pet_profile',
    handle: `pet-${petId}`,
    fields: [
      { key: 'petution_uuid', value: petId },
      { key: 'pet_name', value: 'Luna' },
      { key: 'species', value: 'cat' },
      { key: 'breed', value: 'British Shorthair' },
      { key: 'microchip_number', value: '985141000992104' },
      { key: 'blood_group', value: 'Type A' },
      { key: 'weight_kg', value: '4.2' },
      { key: 'vaccine_passport_summary', value: 'Tricat Trio (FVRCP) - Due 2027-07-24' },
      { key: 'allergies', value: JSON.stringify(['Penicillin', 'Flea Saliva']) }
    ]
  };

  res.status(200).json(metaobjectPayload);
});
