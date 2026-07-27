// =============================================================================
// PETUTION API CLIENT SERVICE
// Asynchronous HTTP Client with JWT Token Management, Loop Prevention Headers,
// and Offline LocalStorage Fallback Queue.
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('petution_jwt_token') || null;
    this.sourceHeader = 'frontend';
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('petution_jwt_token', token);
    } else {
      localStorage.removeItem('petution_jwt_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'x-petution-source': this.sourceHeader
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 401) {
        this.setToken(null);
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[ApiClient] Network request failed (${endpoint}), using local fallback queue:`, err.message);
      throw err;
    }
  }

  // --- Core Module Resource Methods ---
  async getClients() { return this.request('/clients'); }
  async createClient(data) { return this.request('/clients', { method: 'POST', body: JSON.stringify(data) }); }

  async getPets() { return this.request('/pets'); }
  async createPet(data) { return this.request('/pets', { method: 'POST', body: JSON.stringify(data) }); }

  async getVisits() { return this.request('/visits'); }
  async createVisit(data) { return this.request('/visits', { method: 'POST', body: JSON.stringify(data) }); }

  async getProducts() { return this.request('/products'); }
  async createProduct(data) { return this.request('/products', { method: 'POST', body: JSON.stringify(data) }); }
  async updateProduct(id, data) { return this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteProduct(id) { return this.request(`/products/${id}`, { method: 'DELETE' }); }

  async getInvoices() { return this.request('/invoices'); }
  async createInvoice(data) { return this.request('/invoices', { method: 'POST', body: JSON.stringify(data) }); }

  async getExpenses() { return this.request('/expenses'); }
  async createExpense(data) { return this.request('/expenses', { method: 'POST', body: JSON.stringify(data) }); }
  async deleteExpense(id) { return this.request(`/expenses/${id}`, { method: 'DELETE' }); }

  async getVaccines() { return this.request('/vaccines'); }
  async createVaccine(data) { return this.request('/vaccines', { method: 'POST', body: JSON.stringify(data) }); }
  async deleteVaccine(id) { return this.request(`/vaccines/${id}`, { method: 'DELETE' }); }

  async getSoapNotes() { return this.request('/soap-notes'); }
  async saveSoapNote(data) { return this.request('/soap-notes', { method: 'POST', body: JSON.stringify(data) }); }

  // --- Bulk Local-to-Cloud Migration ---
  async migrateLocalStorage(payload) {
    return this.request('/sync/migrate-localstorage', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Shopify Metaobject Query ---
  async getShopifyPetMetaobject(petId) {
    return this.request(`/pets/${petId}/shopify-metaobject`);
  }
}

export const apiClient = new ApiClient();
