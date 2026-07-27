import { unauthenticated } from "../shopify.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { shop, type, action, data } = body;

    if (!shop || !type || !action || !data) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const { admin } = await unauthenticated.admin(shop);

    if (type === "product") {
      if (action === "create") {
        const response = await admin.graphql(`
          mutation productCreate($input: ProductInput!) {
            productCreate(input: $input) {
              product { id title }
              userErrors { field message }
            }
          }
        `, {
          variables: {
            input: {
              title: data.title,
              descriptionHtml: data.description || "",
              status: "ACTIVE"
            }
          }
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { headers: corsHeaders });
      }
    }

    if (type === "customer") {
      if (action === "create") {
        const response = await admin.graphql(`
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer { id firstName lastName email }
              userErrors { field message }
            }
          }
        `, {
          variables: {
            input: {
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              phone: data.phone || ""
            }
          }
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ error: "Unsupported type or action" }), { 
      status: 400, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("Error in sync API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
};

// Handle OPTIONS requests explicitly for CORS preflight
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
};
