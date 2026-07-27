import { authenticate } from "../shopify.server";
import { db } from "../utils/firebase.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    // Use the product ID as the document ID in Firebase
    const docRef = db.collection("products").doc(String(payload.id));

    // Write the payload to Firestore
    await docRef.set({
      ...payload,
      syncedAt: new Date().toISOString(),
      shop: shop
    });

    console.log(`Product ${payload.id} successfully synced to Firebase.`);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error syncing product to Firebase:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
