import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { realGoogleSignInWithPopup, realEmailSignIn, realEmailSignUp, realSendPasswordReset, realSignOut } from '../services/firebaseAuth';
import { syncToFirestore, deleteFromFirestore, fetchUserData, bulkWriteToFirestore } from '../services/firestoreDb';

const syncToShopify = async (type, action, data) => {
  try {
    const shop = localStorage.getItem('petution_shopify_shop') || 'petution.myshopify.com';
    await fetch('https://petution-workspace.onrender.com/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop, type, action, data })
    });
    console.log(`Successfully synced ${type} to Shopify`);
  } catch (e) {
    console.error('Error syncing to Shopify:', e);
  }
};

const AppContext = createContext();

const initialClients = [
  {
    id: 'cli-1',
    name: 'Ahmed Hassan',
    source: 'Facebook Ad',
    governorate: 'Cairo',
    district: 'Maadi',
    street: 'Road 9, Bldg 14',
    phones: [{ phone: '+201001234567', label: 'Primary', isPrimary: true, hasWhatsapp: true }],
    tags: ['VIP', 'Regular'],
    pets: ['pet-1'],
    createdAt: '2026-07-20'
  },
  {
    id: 'cli-2',
    name: 'Sarah Mahmoud',
    source: 'Recommendation',
    governorate: 'Giza',
    district: 'Zayed',
    street: 'Compound 4',
    phones: [{ phone: '+201119876543', label: 'Primary', isPrimary: true, hasWhatsapp: true }],
    tags: ['New Client'],
    pets: ['pet-2'],
    createdAt: '2026-07-22'
  }
];

const initialPets = [
  {
    id: 'pet-1',
    name: 'Milo',
    ageValue: 2,
    ageUnit: 'years',
    species: 'cat',
    gender: 'male',
    vaccinated: true,
    deworming: true,
    antiflea: true,
    castrated: true,
    neuterDate: '2025-03-15',
    breed: 'Persian',
    temperament: 'Calm',
    color: 'White',
    bloodGroup: 'A',
    cardNo: 'CRD-9982',
    protocolNo: 'PRT-102',
    microchipNumber: '985141002938471',
    microchipDate: '2025-01-10',
    microchipLocation: 'Left Scapular',
    isAggressive: false,
    isDeceased: false,
    deathDate: '',
    privateNotes: 'Sensitive skin. Prefers soft handling.',
    tags: ['VIP', 'Indoor Only'],
    nutrition: ['Dry food', 'Soft food'],
    owners: ['cli-1'],
    createdAt: '2026-07-20'
  },
  {
    id: 'pet-2',
    name: 'Rocky',
    ageValue: 4,
    ageUnit: 'years',
    species: 'dog',
    gender: 'male',
    vaccinated: true,
    deworming: true,
    antiflea: false,
    castrated: false,
    neuterDate: '',
    breed: 'Golden Retriever',
    temperament: 'Playful',
    color: 'Golden',
    bloodGroup: 'DEA 1.1+',
    cardNo: 'CRD-4410',
    protocolNo: 'PRT-108',
    microchipNumber: '985141007728192',
    microchipDate: '2024-06-20',
    microchipLocation: 'Neck',
    isAggressive: true,
    isDeceased: false,
    deathDate: '',
    privateNotes: 'Caution: Barking at strange dogs.',
    tags: ['High Energy', 'Guard Dog'],
    nutrition: ['Dry food'],
    owners: ['cli-2'],
    createdAt: '2026-07-22'
  }
];

const initialExpenses = [
  { id: 'exp-1', title: 'Medical Supplies Wholesaler', vendor: 'El-Gomhouria Med', category: 'Supplies', amount: 4500, date: '2026-07-21', paymentMethod: 'Bank Transfer', notes: 'Monthly vaccine & syringe order' },
  { id: 'exp-2', title: 'Clinic Electricity & Utilities', vendor: 'South Cairo Elec', category: 'Utilities', amount: 1200, date: '2026-07-23', paymentMethod: 'Cash', notes: 'July utility bill' }
];

const initialVaccines = [
  {
    id: 'vac-1',
    petId: 'pet-1',
    vaccineName: 'Tricat Trio (FVRCP)',
    manufacturer: 'Zoetis',
    batchNumber: 'ZT-99210',
    administeredDate: '2026-06-15',
    dueDate: '2027-06-15',
    vetName: 'Dr. Khaled ElGendy',
    notes: 'Booster given. No adverse reaction.'
  },
  {
    id: 'vac-2',
    petId: 'pet-1',
    vaccineName: 'Rabies Vaccine (Rabisin)',
    manufacturer: 'Boehringer Ingelheim',
    batchNumber: 'RB-44102',
    administeredDate: '2026-06-15',
    dueDate: '2027-06-15',
    vetName: 'Dr. Khaled ElGendy',
    notes: 'Annual Rabies shot.'
  },
  {
    id: 'vac-3',
    petId: 'pet-2',
    vaccineName: 'Vanguard 7 (DHPP + L4)',
    manufacturer: 'Zoetis',
    batchNumber: 'VG-77219',
    administeredDate: '2026-05-10',
    dueDate: '2027-05-10',
    vetName: 'Dr. Sarah Mahmoud',
    notes: '5-in-1 combo vaccine.'
  }
];

const initialSOAPNotes = [
  {
    id: 'soap-1',
    visitId: 'vis-1',
    petId: 'pet-1',
    vetName: 'Dr. Khaled ElGendy',
    date: '2026-07-24',
    subjective: 'Owner reports mild sneezing for 2 days after indoor stay.',
    tempC: 38.5,
    weightKg: 4.2,
    heartRateBpm: 120,
    respiratoryRateBpm: 24,
    assessment: 'Mild upper respiratory tract inflammation. Hydration good.',
    plan: 'Prescribed oral antibiotic drops and rest. Recheck in 5 days if not improving.',
    rxMedications: [
      { name: 'Amoxicillin Drops 100mg/ml', dosage: '0.5 ml', frequency: 'Twice daily (BID)', duration: '7 days' },
      { name: 'Vet Eye & Nasal Clear Drops', dosage: '2 drops', frequency: 'Three times daily', duration: '5 days' }
    ]
  }
];

const initialVisits = [
  {
    id: 'vis-1',
    petId: 'pet-1',
    clientId: 'cli-1',
    doctorName: 'Dr. Khaled ElGendy',
    visitType: 'Check-up',
    date: '2026-07-24',
    time: '08:00 PM',
    state: 'scheduled',
    reason: 'Annual Checkup'
  }
];

const initialProducts = [
  {
    id: 'prod-1',
    name: 'Feline Rabies Vaccine',
    type: 'product',
    unitType: 'Piece',
    pricingUnit: 'Piece',
    quantity: 45,
    pricePerUnit: 350,
    costPerUnit: 200,
    revenuePerUnit: 150,
    alertThreshold: 10,
    notes: 'Keep refrigerated'
  },
  {
    id: 'serv-1',
    name: 'General Examination & Consultation',
    type: 'service',
    unitType: 'Session',
    pricingUnit: 'Session',
    quantity: 999,
    pricePerUnit: 500,
    costPerUnit: 100,
    revenuePerUnit: 400,
    alertThreshold: 0,
    notes: 'Standard vet examination'
  }
];

const initialInvoices = [
  {
    id: 'inv-1',
    petId: 'pet-1',
    visitId: 'vis-1',
    status: 'paid',
    discountType: 'none',
    discountValue: 0,
    taxPercentage: 14,
    subtotal: 500,
    totalAmount: 570,
    createdAt: '2026-07-24'
  }
];

const initialReminders = [
  { id: 'rem-1', clientId: 'cli-1', petId: 'pet-1', productId: 'prod-1', productName: 'Feline Rabies Vaccine', dueDate: '2027-06-15', status: 'pending', createdAt: '2026-06-15' }
];

const initialTeam = [
  {
    id: 'usr-1',
    name: 'Khaled ElGendy',
    email: 'khaledahmed94.ka@gmail.com',
    role: 'Owner',
    status: 'active'
  }
];

const initialUser = {
  id: 'usr-1',
  name: 'Khaled ElGendy',
  email: 'khaledahmed94.ka@gmail.com',
  role: 'Owner',
  provider: 'email',
  isAuthenticated: true
};

const initialSettings = {
  orgName: 'Petution',
  slug: 'petution',
  phone: '+201114022371',
  address: '12 Main St, Cairo, Egypt',
  website: 'https://app.petution.com'
};

export const AppProvider = ({ children }) => {
  // Workspaces list
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('petution_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem('petution_workspaces');
    return saved ? JSON.parse(saved) : [
      { id: 'ws-1', name: 'Petution', slug: 'petution', plan: 'Second Plan (Trial)' }
    ];
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadCloudData = async () => {
      if (user?.isAuthenticated && user.id !== 'usr-demo' && !dataLoaded) {
        console.log('[AppContext] Fetching user data from Firestore...');
        const cloudData = await fetchUserData(user.id);
        if (cloudData) {
          if (cloudData.clients?.length) setClients(cloudData.clients);
          if (cloudData.pets?.length) setPets(cloudData.pets);
          if (cloudData.visits?.length) setVisits(cloudData.visits);
          if (cloudData.products?.length) setProducts(cloudData.products);
          if (cloudData.invoices?.length) setInvoices(cloudData.invoices);
          if (cloudData.expenses?.length) setExpenses(cloudData.expenses);
          if (cloudData.vaccines?.length) setVaccines(cloudData.vaccines);
          if (cloudData.soapNotes?.length) setSoapNotes(cloudData.soapNotes);
          if (cloudData.team?.length) setTeam(cloudData.team);
          if (cloudData.invitations?.length) setInvitations(cloudData.invitations);
          if (cloudData.settings) setSettingsState(cloudData.settings);
          if (cloudData.notifications?.length) setNotifications(cloudData.notifications);
          if (cloudData.reminders?.length) setReminders(cloudData.reminders);
        }
        setDataLoaded(true);
      }
    };
    loadCloudData();
  }, [user, dataLoaded]);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    const saved = localStorage.getItem('petution_active_ws');
    return saved || 'ws-1';
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('petution_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem('petution_pets');
    return saved ? JSON.parse(saved) : initialPets;
  });

  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem('petution_visits');
    return saved ? JSON.parse(saved) : initialVisits;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('petution_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('petution_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('petution_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [vaccines, setVaccines] = useState(() => {
    const saved = localStorage.getItem('petution_vaccines');
    return saved ? JSON.parse(saved) : initialVaccines;
  });

  const [soapNotes, setSoapNotes] = useState(() => {
    const saved = localStorage.getItem('petution_soap_notes');
    return saved ? JSON.parse(saved) : initialSOAPNotes;
  });

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('petution_team');
    return saved ? JSON.parse(saved) : initialTeam;
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('petution_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [settings, setSettingsState] = useState(() => {
    const saved = localStorage.getItem('petution_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.orgName === 'Petfast') parsed.orgName = 'Petution';
      return parsed;
    }
    return initialSettings;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('petution_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'n-1', title: 'Welcome to Petution!', time: '10m ago', read: false },
      { id: 'n-2', title: 'System trial period active (14 days left)', time: '1h ago', read: false }
    ];
  });

  // Modal & View States
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get('tab') || 'reminders';
    } catch {
      return 'reminders';
    }
  });
  const [isEmbedded, setIsEmbedded] = useState(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get('embedded') === 'true';
    } catch {
      return false;
    }
  });
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    localStorage.setItem('petution_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('petution_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('petution_active_ws', activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    localStorage.setItem('petution_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('petution_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('petution_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('petution_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('petution_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('petution_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('petution_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('petution_vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem('petution_soap_notes', JSON.stringify(soapNotes));
  }, [soapNotes]);

  useEffect(() => {
    localStorage.setItem('petution_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('petution_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const updateSettings = (newSettings) => {
    setSettingsState(newSettings);
    syncToFirestore(user?.id, 'settings', 'global', newSettings);
    // Sync with workspace list
    setWorkspaces(prev => prev.map(ws => 
      ws.id === activeWorkspaceId 
        ? { ...ws, name: newSettings.orgName, slug: newSettings.slug }
        : ws
    ));
  };

  const registerClinic = (clinicData) => {
    const newWs = {
      id: `ws-${Date.now()}`,
      name: clinicData.clinicName,
      slug: clinicData.clinicName.toLowerCase().replace(/\s+/g, '-'),
      plan: clinicData.plan || 'Trial Plan'
    };
    setWorkspaces(prev => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    updateSettings({
      ...settings,
      orgName: clinicData.clinicName,
      slug: newWs.slug,
      phone: clinicData.phone || settings.phone,
      address: `${clinicData.district || ''}, ${clinicData.governorate || ''}`
    });

    setNotifications(prev => [
      { id: `n-${Date.now()}`, title: `Registered workspace: ${clinicData.clinicName}`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  const switchWorkspace = (wsId) => {
    const ws = workspaces.find(w => w.id === wsId);
    if (ws) {
      setActiveWorkspaceId(ws.id);
      setSettingsState(prev => ({ ...prev, orgName: ws.name, slug: ws.slug }));
    }
  };

  const deleteWorkspace = (wsId) => {
    if (workspaces.length <= 1) {
      alert('Cannot delete the only remaining workspace. You must have at least one active clinic.');
      return;
    }

    const targetWs = workspaces.find(w => w.id === wsId);
    const targetName = targetWs ? targetWs.name : 'workspace';

    const updatedWorkspaces = workspaces.filter(w => w.id !== wsId);
    setWorkspaces(updatedWorkspaces);

    if (activeWorkspaceId === wsId) {
      const nextWs = updatedWorkspaces[0];
      setActiveWorkspaceId(nextWs.id);
      setSettingsState(prev => ({ ...prev, orgName: nextWs.name, slug: nextWs.slug }));
    }

    alert(`Clinic workspace "${targetName}" has been deleted.`);
  };


  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
    syncToFirestore(user?.id, 'clients', newClient.id, newClient);
    syncToShopify('customer', 'create', {
      firstName: newClient.name.split(' ')[0],
      lastName: newClient.name.split(' ').slice(1).join(' '),
      email: newClient.email || '',
      phone: newClient.phones?.[0]?.phone || ''
    });
  };

  const addPet = (petData) => {
    const newPet = {
      ...petData,
      id: `pet-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPets(prev => [newPet, ...prev]);
    syncToFirestore(user?.id, 'pets', newPet.id, newPet);
  };

  const addVisit = (visitData) => {
    const newVisit = {
      ...visitData,
      id: `vis-${Date.now()}`
    };
    setVisits(prev => [newVisit, ...prev]);
    syncToFirestore(user?.id, 'visits', newVisit.id, newVisit);
  };

  const [stockLogs, setStockLogs] = useState(() => {
    const saved = localStorage.getItem('petution_stocklogs');
    return saved ? JSON.parse(saved) : [
      { id: 'log-1', itemName: 'Feline Rabies Vaccine', change: '+45 units', user: 'Khaled ElGendy', date: '2026-07-24' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('petution_stocklogs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  const addProduct = (prodData) => {
    const newProd = {
      ...prodData,
      id: `prod-${Date.now()}`,
      revenuePerUnit: (prodData.pricePerUnit || 0) - (prodData.costPerUnit || 0)
    };
    setProducts(prev => [newProd, ...prev]);
    syncToFirestore(user?.id, 'products', newProd.id, newProd);
    setStockLogs(prev => [
      { id: `log-${Date.now()}`, itemName: prodData.name, change: `+${prodData.quantity || 1} units (Created)`, user: 'Khaled ElGendy', date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
    syncToShopify('product', 'create', {
      title: newProd.name,
      description: newProd.notes || ''
    });
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const merged = { ...p, ...updatedData };
      const price = merged.pricePerUnit !== undefined ? Number(merged.pricePerUnit) : 0;
      const cost = merged.costPerUnit !== undefined ? Number(merged.costPerUnit) : 0;
      const finalProd = { ...merged, revenuePerUnit: price - cost };
      syncToFirestore(user?.id, 'products', id, finalProd);
      return finalProd;
    }));
    setStockLogs(prev => [
      { id: `log-${Date.now()}`, itemName: updatedData.name || 'Product', change: `Updated (${updatedData.quantity !== undefined ? updatedData.quantity : 'stock'})`, user: 'Khaled ElGendy', date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    deleteFromFirestore(user?.id, 'products', id);
  };

  const addInvoice = (invData) => {
    const newInv = {
      ...invData,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInv, ...prev]);
    syncToFirestore(user?.id, 'invoices', newInv.id, newInv);
  };

  const addExpense = (expData) => {
    const newExp = {
      ...expData,
      id: `exp-${Date.now()}`,
      date: expData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExp, ...prev]);
    syncToFirestore(user?.id, 'expenses', newExp.id, newExp);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    deleteFromFirestore(user?.id, 'expenses', id);
  };

  const addVaccine = (vacData) => {
    const newVac = {
      ...vacData,
      id: `vac-${Date.now()}`
    };
    setVaccines(prev => [newVac, ...prev]);
    syncToFirestore(user?.id, 'vaccines', newVac.id, newVac);
  };

  const deleteVaccine = (id) => {
    setVaccines(prev => prev.filter(v => v.id !== id));
    deleteFromFirestore(user?.id, 'vaccines', id);
  };

  const addReminder = (remData) => {
    const newRem = {
      ...remData,
      id: `rem-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReminders(prev => [newRem, ...prev]);
    syncToFirestore(user?.id, 'reminders', newRem.id, newRem);
  };

  const updateReminderStatus = (id, newStatus) => {
    setReminders(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: newStatus } : r);
      const rem = updated.find(r => r.id === id);
      if (rem) syncToFirestore(user?.id, 'reminders', rem.id, rem);
      return updated;
    });
  };

  const saveSOAPNote = (soapData) => {
    setSoapNotes(prev => {
      const existingIndex = prev.findIndex(s => s.visitId === soapData.visitId || s.id === soapData.id);
      if (existingIndex >= 0) {
        const updated = prev.map((s, idx) => idx === existingIndex ? { ...s, ...soapData } : s);
        syncToFirestore(user?.id, 'soapNotes', updated[existingIndex].id, updated[existingIndex]);
        return updated;
      }
      const newSoap = {
        ...soapData,
        id: `soap-${Date.now()}`
      };
      syncToFirestore(user?.id, 'soapNotes', newSoap.id, newSoap);
      return [newSoap, ...prev];
    });
  };

  const migrateLocalStorageToCloud = async () => {
    if (!user || !user.id || user.id === 'usr-demo') {
      alert('You must be logged in to a real account to migrate data to the cloud.');
      return;
    }
    try {
      const collections = [
        { name: 'clients', data: JSON.parse(localStorage.getItem('petution_clients') || '[]') },
        { name: 'pets', data: JSON.parse(localStorage.getItem('petution_pets') || '[]') },
        { name: 'visits', data: JSON.parse(localStorage.getItem('petution_visits') || '[]') },
        { name: 'products', data: JSON.parse(localStorage.getItem('petution_products') || '[]') },
        { name: 'invoices', data: JSON.parse(localStorage.getItem('petution_invoices') || '[]') },
        { name: 'expenses', data: JSON.parse(localStorage.getItem('petution_expenses') || '[]') },
        { name: 'vaccines', data: JSON.parse(localStorage.getItem('petution_vaccines') || '[]') },
        { name: 'soapNotes', data: JSON.parse(localStorage.getItem('petution_soap_notes') || '[]') }
      ];

      for (const col of collections) {
        if (col.data.length > 0) {
          await bulkWriteToFirestore(user.id, col.name, col.data);
        }
      }
      
      alert('Successfully migrated all local data to Firestore!');
    } catch (err) {
      console.error('[AppContext Sync] Auto-migration offline fallback:', err);
      alert('Migration failed: ' + err.message);
    }
  };

  const importFullBackup = (backupData) => {
    if (!backupData || typeof backupData !== 'object') {
      alert('Invalid backup file format.');
      return;
    }
    if (backupData.clients) setClients(backupData.clients);
    if (backupData.pets) setPets(backupData.pets);
    if (backupData.visits) setVisits(backupData.visits);
    if (backupData.products) setProducts(backupData.products);
    if (backupData.invoices) setInvoices(backupData.invoices);
    if (backupData.expenses) setExpenses(backupData.expenses);
    if (backupData.vaccines) setVaccines(backupData.vaccines);
    if (backupData.soapNotes) setSoapNotes(backupData.soapNotes);
    if (backupData.settings) updateSettings(backupData.settings);
    alert('System backup restored successfully!');
  };

  const importClientsData = (newClients) => {
    if (!Array.isArray(newClients) || newClients.length === 0) {
      alert('No valid client data found in file.');
      return;
    }
    const formatted = newClients.map((c, idx) => {
      let phones;
      try {
        phones = c.phones ? (typeof c.phones === 'string' ? JSON.parse(c.phones) : c.phones) : [{ phone: c.phone || c.PrimaryPhone || '', label: 'Primary', isPrimary: true }];
      } catch { phones = [{ phone: c.phone || c.PrimaryPhone || '', label: 'Primary', isPrimary: true }]; }
      let tags;
      try {
        tags = c.tags ? (typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags) : ['Imported'];
      } catch { tags = ['Imported']; }
      return {
        id: c.id || `cli-imp-${Date.now()}-${idx}`,
        name: c.name || c.ClientName || c.PetOwnerName || 'Imported Client',
        source: c.source || c.Source || 'Imported',
        governorate: c.governorate || c.Governorate || 'Cairo',
        district: c.district || c.District || '',
        street: c.street || c.Street || '',
        phones,
        tags,
        pets: [],
        createdAt: c.createdAt || c.CreatedDate || new Date().toISOString().split('T')[0]
      };
    });
    setClients(prev => [...formatted, ...prev]);
    alert(`Successfully imported ${formatted.length} clients!`);
  };

  const importPetsData = (newPets) => {
    if (!Array.isArray(newPets) || newPets.length === 0) {
      alert('No valid pet data found in file.');
      return;
    }
    const formatted = newPets.map((p, idx) => ({
      id: p.id || `pet-imp-${Date.now()}-${idx}`,
      name: p.name || p.PetName || 'Imported Pet',
      ageValue: (p.ageValue !== undefined && p.ageValue !== '') ? Number(p.ageValue) : ((p.Age !== undefined && p.Age !== '') ? Number(p.Age) : 1),
      ageUnit: p.ageUnit || p.AgeUnit || 'years',
      species: (p.species || p.Species || p.Type || 'cat').toLowerCase(),
      gender: p.gender || p.Gender || 'male',
      vaccinated: String(p.vaccinated ?? p.Vaccinated ?? 'false').toLowerCase() === 'true' || String(p.vaccinated ?? p.Vaccinated ?? '') === 'Yes',
      deworming: String(p.deworming ?? p.Deworming ?? 'false').toLowerCase() === 'true' || String(p.deworming ?? p.Deworming ?? '') === 'Yes',
      antiflea: String(p.antiflea ?? p.Antiflea ?? 'false').toLowerCase() === 'true' || String(p.antiflea ?? p.Antiflea ?? '') === 'Yes',
      castrated: String(p.castrated ?? p.Castrated ?? 'false').toLowerCase() === 'true' || String(p.castrated ?? p.Castrated ?? '') === 'Yes',
      neuterDate: p.neuterDate || p.NeuterDate || '',
      breed: p.breed || p.Breed || '',
      temperament: p.temperament || p.Temperament || 'Calm',
      color: p.color || p.Color || '',
      bloodGroup: p.bloodGroup || p.BloodGroup || 'Unspecified',
      cardNo: p.cardNo || p.CardNo || '',
      protocolNo: p.protocolNo || p.ProtocolNo || '',
      microchipNumber: p.microchipNumber || p.MicrochipNumber || '',
      microchipDate: p.microchipDate || p.MicrochipDate || '',
      microchipLocation: p.microchipLocation || p.MicrochipLocation || '',
      isAggressive: String(p.isAggressive ?? p.IsAggressive ?? 'false').toLowerCase() === 'true',
      isDeceased: String(p.isDeceased ?? p.IsDeceased ?? 'false').toLowerCase() === 'true',
      deathDate: p.deathDate || p.DeathDate || '',
      privateNotes: p.privateNotes || p.PrivateNotes || '',
      tags: Array.isArray(p.tags) ? p.tags : (p.Tags ? String(p.Tags).split(',') : ['Imported']),
      nutrition: ['Dry food'],
      owners: [],
      createdAt: p.createdAt || p.CreatedDate || new Date().toISOString().split('T')[0]
    }));
    setPets(prev => [...formatted, ...prev]);
    alert(`Successfully imported ${formatted.length} pets!`);
  };

  const importProductsData = (newProds) => {
    if (!Array.isArray(newProds) || newProds.length === 0) {
      alert('No valid product data found in file.');
      return;
    }
    const formatted = newProds.map((p, idx) => {
      const price = (p.pricePerUnit !== undefined && p.pricePerUnit !== '') ? Number(p.pricePerUnit) : ((p.PricePerUnit !== undefined && p.PricePerUnit !== '') ? Number(p.PricePerUnit) : 100);
      const cost = (p.costPerUnit !== undefined && p.costPerUnit !== '') ? Number(p.costPerUnit) : ((p.CostPerUnit !== undefined && p.CostPerUnit !== '') ? Number(p.CostPerUnit) : 50);
      const qty = (p.quantity !== undefined && p.quantity !== '') ? Number(p.quantity) : ((p.Quantity !== undefined && p.Quantity !== '') ? Number(p.Quantity) : 10);
      const threshold = (p.alertThreshold !== undefined && p.alertThreshold !== '') ? Number(p.alertThreshold) : ((p.AlertThreshold !== undefined && p.AlertThreshold !== '') ? Number(p.AlertThreshold) : 5);
      return {
        id: p.id || `prod-imp-${Date.now()}-${idx}`,
        name: p.name || p.ItemName || 'Imported Product',
        type: p.type || p.Type || 'product',
        unitType: p.unitType || p.UnitType || 'Piece',
        pricingUnit: p.pricingUnit || p.PricingUnit || 'Piece',
        pricePerUnit: price,
        costPerUnit: cost,
        revenuePerUnit: price - cost,
        quantity: qty,
        alertThreshold: threshold,
        notes: p.notes || p.Notes || ''
      };
    });
    setProducts(prev => [...formatted, ...prev]);
    alert(`Successfully imported ${formatted.length} products/services!`);
  };

  const importInvoicesData = (newInvs) => {
    if (!Array.isArray(newInvs) || newInvs.length === 0) {
      alert('No valid invoice data found in file.');
      return;
    }
    const formatted = newInvs.map((inv, idx) => ({
      id: inv.id || `inv-imp-${Date.now()}-${idx}`,
      petId: inv.petId || '',
      visitId: inv.visitId || '',
      status: inv.status || inv.Status || 'pending',
      discountType: inv.discountType || 'none',
      discountValue: Number(inv.discountValue) || 0,
      taxPercentage: Number(inv.taxPercentage || inv.TaxPercentage) || 14,
      subtotal: Number(inv.subtotal || inv.Subtotal) || 0,
      totalAmount: Number(inv.totalAmount || inv.TotalAmount || inv.Amount) || 0,
      createdAt: inv.createdAt || inv.CreatedDate || new Date().toISOString().split('T')[0]
    }));
    setInvoices(prev => [...formatted, ...prev]);
    alert(`Successfully imported ${formatted.length} invoices!`);
  };

  const [invitations, setInvitations] = useState(() => {
    const saved = localStorage.getItem('petution_invitations');
    return saved ? JSON.parse(saved) : [
      { id: 'inv-1', name: 'Dr. Sarah Mahmoud', email: 'sarah.m@petution.com', role: 'Vet', sentAt: '2026-07-23', status: 'Pending' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('petution_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('petution_invitations', JSON.stringify(invitations));
  }, [invitations]);

  const inviteMember = (inviteData) => {
    const newInv = {
      id: `inv-${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role || 'Vet',
      sentAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setInvitations(prev => [newInv, ...prev]);
    syncToFirestore(user?.id, 'invitations', newInv.id, newInv);

    // Also add to active team list if auto-accepted
    const newMember = {
      id: `usr-${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role || 'Vet',
      status: 'invited'
    };
    setTeam(prev => [newMember, ...prev]);
    syncToFirestore(user?.id, 'team', newMember.id, newMember);
  };

  const updateMemberRole = (memberId, newRole) => {
    setTeam(prev => {
      const updated = prev.map(m => m.id === memberId ? { ...m, role: newRole } : m);
      const member = updated.find(m => m.id === memberId);
      if (member) syncToFirestore(user?.id, 'team', member.id, member);
      return updated;
    });
  };

  const removeMember = (memberId) => {
    setTeam(prev => prev.filter(m => m.id !== memberId));
    deleteFromFirestore(user?.id, 'team', memberId);
  };

  const cancelInvitation = (invId) => {
    setInvitations(prev => prev.filter(i => i.id !== invId));
    deleteFromFirestore(user?.id, 'invitations', invId);
  };

  const loginWithEmail = async (email, password) => {
    if (email === 'khaledahmed94.ka@gmail.com' && password === 'demo123') {
      setUser({
        id: 'usr-demo',
        name: 'Dr. Khaled ElGendy (Demo)',
        email,
        role: 'Owner',
        provider: 'email',
        isAuthenticated: true
      });
      return;
    }

    try {
      const res = await realEmailSignIn(email, password);
      setUser(res.user);
    } catch (err) {
      console.error('[Email Auth] Sign in failed:', err);
      throw err;
    }
  };

  const loginWithProvider = async (providerName, customEmail, customName) => {
    if (providerName === 'google') {
      try {
        const res = await realGoogleSignInWithPopup();
        setUser(res.user);
      } catch (err) {
        console.error('[Google Auth] Sign in failed:', err);
        throw err; // Let the UI handle the error/loading state
      }
    } else if (providerName === 'apple') {
      // Mock Apple login for now
      const loggedUser = {
        id: `usr-${Date.now()}`,
        name: customName || 'Khaled ElGendy',
        email: customEmail || 'khaled.elgendy@icloud.com',
        role: 'Owner',
        provider: 'apple',
        isAuthenticated: true
      };
      setUser(loggedUser);
    }
  };

  const signup = async (name, email, password, clinicName) => {
    try {
      const res = await realEmailSignUp(email, password, name);
      setUser(res.user);
      registerClinic({ clinicName, ownerName: name, email, phone: '' });
    } catch (err) {
      console.error('[Email Auth] Sign up failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    await realSignOut();
    setUser(prev => ({ ...prev, isAuthenticated: false }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginWithEmail,
        loginWithProvider,
        signup,
        logout,
        workspaces,
        activeWorkspaceId,
        registerClinic,
        switchWorkspace,
        deleteWorkspace,
        clients,
        addClient,
        importClientsData,
        pets,
        addPet,
        importPetsData,
        visits,
        setVisits,
        addVisit,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        importProductsData,
        stockLogs,
        invoices,
        addInvoice,
        importFullBackup,
        importInvoicesData,
        expenses,
        addExpense,
        deleteExpense,
        vaccines,
        addVaccine,
        deleteVaccine,
        reminders,
        addReminder,
        updateReminderStatus,
        soapNotes,
        saveSOAPNote,
        migrateLocalStorageToCloud,
        team,
        setTeam,
        invitations,
        inviteMember,
        updateMemberRole,
        removeMember,
        cancelInvitation,
        settings,
        setSettings: updateSettings,
        notifications,
        setNotifications,
        activeTab,
        setActiveTab,
        activeDrawer,
        setActiveDrawer,
        activeModalItem,
        setActiveModalItem,
        showWorkspaceMenu,
        setShowWorkspaceMenu,
        showNotifications,
        setShowNotifications,
        isEmbedded
      }}
    >
      {children}
    </AppContext.Provider>
  );



};


export const useApp = () => useContext(AppContext);
