import { authenticate } from "../shopify.server";
import { db } from "../utils/firebase.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  
  if (!db) {
    console.error('Firestore Admin DB is not initialized. Cannot sync customer.');
    return new Response('Firebase not configured', { status: 500 });
  }

  try {
    const customer = payload;
    
    // Transform Shopify Customer to Petution Client format
    const newClient = {
      id: `cli-${Date.now()}`, // Or use Shopify ID: `shop-${customer.id}`
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      phone: customer.phone || customer.default_address?.phone || '',
      email: customer.email || '',
      address: customer.default_address ? `${customer.default_address.address1}, ${customer.default_address.city}` : '',
      tags: customer.tags ? customer.tags.split(',').map(t => t.trim()) : [],
      createdAt: new Date().toISOString().split('T')[0],
      source: 'Shopify'
    };

    // Note: We need a mapping from Shopify Store to Petution User ID.
    // For now, we will store them globally or require the user to configure their User ID in the app settings.
    // As a placeholder, we'll write to a "shopify_sync_queue" or a default user.
    // In a real multi-tenant app, the shop domain would map to a Petution user ID.
    const syncDoc = db.collection('shopify_sync').doc(shop).collection('clients').doc(customer.id.toString());
    
    await syncDoc.set(newClient, { merge: true });
    console.log(`Successfully synced customer ${customer.id} to Firestore for shop ${shop}`);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(`Error processing ${topic} webhook:`, error);
    return new Response('Error', { status: 500 });
  }
};
