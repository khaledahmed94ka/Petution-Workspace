import { authenticate } from "../shopify.server";
import { getFirestore } from "firebase-admin/firestore";
import "../utils/firebase.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    const db = getFirestore();
    // Use the product ID as the document ID in Firebase
    const docRef = db.collection("products").doc(String(payload.id));

    // Update the payload in Firestore (using set with merge: true)
    // This creates the document if it doesn't exist, or updates it if it does
    await docRef.set({
      ...payload,
      updatedAt: new Date().toISOString(),
      shop: shop
    }, { merge: true });

    console.log(`Product ${payload.id} successfully updated in Firebase.`);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating product in Firebase:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
