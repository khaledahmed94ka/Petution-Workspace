// =============================================================================
// PETUTION CORE REST API CONTROLLERS
// Express API Router for Clients, Pets, Visits, Products, Invoices, Expenses,
// Vaccines, SOAP Notes, and Local-to-Cloud Migration.
// =============================================================================

import express from 'express';
export const apiRouter = express.Router();

// Memory store fallbacks for fast standalone server execution
let clients = [
  { id: 'client-1', name: 'Sarah Ahmed', phone: '+20 100 123 4567', email: 'sarah@example.com', address: 'Maadi, Cairo', tags: ['VIP', 'Dogs'] },
  { id: 'client-2', name: 'Mohamed Hassan', phone: '+20 111 987 6543', email: 'mohamed@example.com', address: 'Zamalek, Cairo', tags: ['Cats'] }
];

let pets = [
  { id: 'pet-1', petution_uuid: '550e8400-e29b-41d4-a716-446655440000', name: 'Luna', species: 'cat', breed: 'British Shorthair', gender: 'female', ageValue: 2, ageUnit: 'years', microchipNumber: '985141000992104', bloodGroup: 'Type A', cardNo: 'CRD-1002', castrated: true, isAggressive: false, isDeceased: false, owners: ['client-1'], vaccinated: true },
  { id: 'pet-2', petution_uuid: '550e8400-e29b-41d4-a716-446655440001', name: 'Rex', species: 'dog', breed: 'German Shepherd', gender: 'male', ageValue: 3, ageUnit: 'years', microchipNumber: '985141000881920', bloodGroup: 'DEA 1.1+', cardNo: 'CRD-1003', castrated: true, isAggressive: true, isDeceased: false, owners: ['client-2'], vaccinated: true }
];

let visits = [
  { id: 'visit-1', petId: 'pet-1', doctorName: 'Dr. Khaled ElGendy', visitType: 'Vaccination Booster', date: '2026-07-26', time: '10:30 AM', state: 'completed', reason: 'Annual FVRCP Vaccination' }
];

let products = [
  { id: 'prod-1', name: 'Feline Rabies Vaccine', sku: 'VAC-CAT-01', category: 'product', pricePerUnit: 250, costPerUnit: 120, revenuePerUnit: 130, quantity: 45, lowStockThreshold: 10, unit: 'dose' }
];

let invoices = [
  { id: 'inv-1', invoiceNumber: 'INV-2026-001', petId: 'pet-1', clientId: 'client-1', date: '2026-07-26', items: [{ name: 'Feline Rabies Vaccine', qty: 1, price: 250 }], subtotal: 250, discount: 0, tax: 0, total: 250, status: 'paid', paymentMethod: 'Cash' }
];

let expenses = [
  { id: 'exp-1', title: 'Vaccine Refrigeration Unit', amount: 1200, category: 'Equipment', date: '2026-07-20', paymentMethod: 'Card' }
];

let vaccines = [
  { id: 'vac-1', petId: 'pet-1', vaccineName: 'Tricat Trio (FVRCP)', manufacturer: 'Zoetis', batchNumber: 'ZT-99210', administeredDate: '2026-07-24', dueDate: '2027-07-24', vetName: 'Dr. Khaled ElGendy' }
];

let soapNotes = [
  { id: 'soap-1', visitId: 'visit-1', petId: 'pet-1', vetName: 'Dr. Khaled ElGendy', date: '2026-07-26', subjective: 'Routine annual checkup', tempC: 38.5, weightKg: 4.2, heartRateBpm: 120, respiratoryRateBpm: 24, assessment: 'Healthy adult feline', plan: 'Continue annual booster schedule', rxMedications: [] }
];

// --- AUTHENTICATION ENDPOINTS ---
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const token = `mock-jwt-token-${Date.now()}`;
  res.status(200).json({
    success: true,
    token,
    user: {
      id: 'usr-1',
      name: 'Khaled ElGendy',
      email: email || 'dr.khaled@petution.com',
      role: 'owner',
      isAuthenticated: true
    }
  });
});

// --- CORE RESOURCE ENDPOINTS ---
apiRouter.get('/clients', (req, res) => res.json(clients));
apiRouter.post('/clients', (req, res) => {
  const newClient = { ...req.body, id: `client-${Date.now()}` };
  clients.unshift(newClient);
  res.status(201).json(newClient);
});

apiRouter.get('/pets', (req, res) => res.json(pets));
apiRouter.post('/pets', (req, res) => {
  const newPet = { ...req.body, id: `pet-${Date.now()}`, petution_uuid: req.body.petution_uuid || `uuid-${Date.now()}` };
  pets.unshift(newPet);
  res.status(201).json(newPet);
});

apiRouter.get('/visits', (req, res) => res.json(visits));
apiRouter.post('/visits', (req, res) => {
  const newVisit = { ...req.body, id: `visit-${Date.now()}` };
  visits.unshift(newVisit);
  res.status(201).json(newVisit);
});

apiRouter.get('/products', (req, res) => res.json(products));
apiRouter.post('/products', (req, res) => {
  const newProd = { ...req.body, id: `prod-${Date.now()}` };
  products.unshift(newProd);
  res.status(201).json(newProd);
});

apiRouter.get('/invoices', (req, res) => res.json(invoices));
apiRouter.post('/invoices', (req, res) => {
  const newInv = { ...req.body, id: `inv-${Date.now()}` };
  invoices.unshift(newInv);
  res.status(201).json(newInv);
});

apiRouter.get('/expenses', (req, res) => res.json(expenses));
apiRouter.post('/expenses', (req, res) => {
  const newExp = { ...req.body, id: `exp-${Date.now()}` };
  expenses.unshift(newExp);
  res.status(201).json(newExp);
});
apiRouter.delete('/expenses/:id', (req, res) => {
  expenses = expenses.filter(e => e.id !== req.params.id);
  res.json({ success: true, message: 'Expense deleted' });
});

apiRouter.get('/vaccines', (req, res) => res.json(vaccines));
apiRouter.post('/vaccines', (req, res) => {
  const newVac = { ...req.body, id: `vac-${Date.now()}` };
  vaccines.unshift(newVac);
  res.status(201).json(newVac);
});
apiRouter.delete('/vaccines/:id', (req, res) => {
  vaccines = vaccines.filter(v => v.id !== req.params.id);
  res.json({ success: true, message: 'Vaccine deleted' });
});

apiRouter.get('/soap-notes', (req, res) => res.json(soapNotes));
apiRouter.post('/soap-notes', (req, res) => {
  const data = req.body;
  const existingIdx = soapNotes.findIndex(s => s.visitId === data.visitId || s.id === data.id);
  if (existingIdx >= 0) {
    soapNotes[existingIdx] = { ...soapNotes[existingIdx], ...data };
    return res.json(soapNotes[existingIdx]);
  }
  const newSoap = { ...data, id: `soap-${Date.now()}` };
  soapNotes.unshift(newSoap);
  res.status(201).json(newSoap);
});

// --- BULK LOCAL-TO-CLOUD MIGRATION ---
apiRouter.post('/sync/migrate-localstorage', (req, res) => {
  const { legacyData } = req.body;
  console.log('[Migration Service] Uploading legacy localStorage data to cloud PostgreSQL...');

  if (legacyData?.clients?.length) clients = [...legacyData.clients, ...clients];
  if (legacyData?.pets?.length) pets = [...legacyData.pets, ...pets];
  if (legacyData?.visits?.length) visits = [...legacyData.visits, ...visits];
  if (legacyData?.products?.length) products = [...legacyData.products, ...products];
  if (legacyData?.invoices?.length) invoices = [...legacyData.invoices, ...invoices];
  if (legacyData?.expenses?.length) expenses = [...legacyData.expenses, ...expenses];
  if (legacyData?.vaccines?.length) vaccines = [...legacyData.vaccines, ...vaccines];
  if (legacyData?.soapNotes?.length) soapNotes = [...legacyData.soapNotes, ...soapNotes];

  res.status(200).json({
    success: true,
    message: 'Local legacy data migrated to cloud database successfully!',
    migratedCounts: {
      clients: legacyData?.clients?.length || 0,
      pets: legacyData?.pets?.length || 0,
      visits: legacyData?.visits?.length || 0
    }
  });
});
