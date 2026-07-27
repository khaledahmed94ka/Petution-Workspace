import { authenticate } from "../shopify.server";
import { db } from "../utils/firebase.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (!db) {
    console.error('Firestore Admin DB is not initialized. Cannot sync order.');
    return new Response('Firebase not configured', { status: 500 });
  }

  try {
    const order = payload;
    
    // Transform Shopify Order to Petution Invoice format
    const newInvoice = {
      id: `inv-${Date.now()}`, // Or use `shop-${order.id}`
      clientId: order.customer ? `shop-${order.customer.id}` : 'guest',
      clientName: order.customer ? `${order.customer.first_name} ${order.customer.last_name}`.trim() : 'Guest Customer',
      date: order.created_at.split('T')[0],
      total: parseFloat(order.total_price),
      discount: parseFloat(order.total_discounts),
      net: parseFloat(order.total_price), // Since total_price already includes discount in Shopify sometimes, but we map it roughly
      amountPaid: parseFloat(order.total_price), // Assuming paid if we listen to orders/paid or assume paid
      balance: 0,
      paymentMethod: order.gateway || 'Shopify',
      items: order.line_items.map(item => ({
        id: `shop-item-${item.id}`,
        name: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
        total: parseFloat(item.price) * item.quantity
      })),
      createdAt: new Date().toISOString().split('T')[0],
      source: 'Shopify'
    };

    const syncDoc = db.collection('shopify_sync').doc(shop).collection('invoices').doc(order.id.toString());
    
    await syncDoc.set(newInvoice, { merge: true });
    console.log(`Successfully synced order ${order.id} to Firestore for shop ${shop}`);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(`Error processing ${topic} webhook:`, error);
    return new Response('Error', { status: 500 });
  }
};
