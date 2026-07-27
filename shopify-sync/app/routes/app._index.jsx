import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <s-page heading="Petution Dashboard">
      <s-section heading="Sync Status: Active 🟢">
        <s-paragraph>
          Your Shopify store is successfully connected to the Petution Firebase backend.
        </s-paragraph>
      </s-section>

      <s-section heading="Data Synchronized">
        <s-unordered-list>
          <s-list-item>
            <s-text><strong>Customers</strong>: Synced automatically when created.</s-text>
          </s-list-item>
          <s-list-item>
            <s-text><strong>Orders</strong>: Synced automatically when created.</s-text>
          </s-list-item>
          <s-list-item>
            <s-text><strong>Products</strong>: Synced automatically when created or updated.</s-text>
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Need Help?">
        <s-paragraph>
          If data stops syncing, please ensure that your Render server is online and that your Firebase Service Account credentials are valid.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
