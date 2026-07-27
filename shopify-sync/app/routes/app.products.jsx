import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Products() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe 
        src="https://petution-app.onrender.com?tab=products" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Petution Products"
        allow="clipboard-write"
      />
    </div>
  );
}
