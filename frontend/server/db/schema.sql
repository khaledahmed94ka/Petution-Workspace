-- =============================================================================
-- PETUTION VETERINARY CLINIC MANAGEMENT SYSTEM
-- PostgreSQL Relational Database Schema (v1.0.0)
-- Multi-Tenant Database Architecture for Shopify & IDEXX Sync Ecosystem
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. WORKSPACES (Multi-Tenant Clinic Workspaces)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    org_name VARCHAR(255) NOT NULL DEFAULT 'Petution Veterinary Center',
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    tax_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. USERS (Staff & Clinicians)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- owner, admin, vet, receptionist
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_workspace ON users(workspace_id);
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 3. CLIENTS (Pet Owners)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL, -- E.164 formatted
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    shopify_customer_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_workspace ON clients(workspace_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);

-- -----------------------------------------------------------------------------
-- 4. PETS (Patients)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    petution_uuid UUID UNIQUE DEFAULT uuid_generate_v4(),
    owner_ids UUID[] DEFAULT '{}',
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL DEFAULT 'cat',
    breed VARCHAR(255),
    gender VARCHAR(20) NOT NULL DEFAULT 'male',
    age_value INT DEFAULT 1,
    age_unit VARCHAR(20) DEFAULT 'years',
    microchip_number VARCHAR(100),
    microchip_location VARCHAR(100),
    microchip_date DATE,
    blood_group VARCHAR(50),
    card_no VARCHAR(100),
    protocol_no VARCHAR(100),
    castrated BOOLEAN DEFAULT FALSE,
    neuter_date DATE,
    is_aggressive BOOLEAN DEFAULT FALSE,
    is_deceased BOOLEAN DEFAULT FALSE,
    death_date DATE,
    temperament VARCHAR(50) DEFAULT 'Calm',
    private_notes TEXT,
    vaccinated BOOLEAN DEFAULT FALSE,
    deworming BOOLEAN DEFAULT FALSE,
    antiflea BOOLEAN DEFAULT FALSE,
    allergies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_workspace ON pets(workspace_id);
CREATE INDEX idx_pets_microchip ON pets(microchip_number);
CREATE INDEX idx_pets_petution_uuid ON pets(petution_uuid);

-- -----------------------------------------------------------------------------
-- 5. VISITS (Appointments & Consultations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    visit_type VARCHAR(100) NOT NULL DEFAULT 'Consultation',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time VARCHAR(20) NOT NULL DEFAULT '10:00 AM',
    state VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visits_workspace ON visits(workspace_id);
CREATE INDEX idx_visits_pet ON visits(pet_id);
CREATE INDEX idx_visits_date ON visits(date);

-- -----------------------------------------------------------------------------
-- 6. SOAP NOTES (Veterinary Clinical Notes & Rx Prescriptions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS soap_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    visit_id UUID UNIQUE REFERENCES visits(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    vet_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    subjective TEXT,
    temp_c NUMERIC(4, 1) DEFAULT 38.5,
    weight_kg NUMERIC(5, 2) DEFAULT 4.0,
    heart_rate_bpm INT DEFAULT 120,
    respiratory_rate_rpm INT DEFAULT 24,
    assessment TEXT,
    plan TEXT,
    rx_medications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_soap_notes_visit ON soap_notes(visit_id);
CREATE INDEX idx_soap_notes_pet ON soap_notes(pet_id);

-- -----------------------------------------------------------------------------
-- 7. PRODUCTS (Inventory Items & Services)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    category VARCHAR(50) NOT NULL DEFAULT 'product', -- product, service
    price_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    revenue_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    unit VARCHAR(50) DEFAULT 'unit',
    notes TEXT,
    shopify_product_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_workspace ON products(workspace_id);
CREATE INDEX idx_products_sku ON products(sku);

-- -----------------------------------------------------------------------------
-- 8. INVOICES (Billing & Financial Records)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'paid', -- paid, pending, unpaid
    payment_method VARCHAR(50) DEFAULT 'Cash',
    notes TEXT,
    shopify_order_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_workspace ON invoices(workspace_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- -----------------------------------------------------------------------------
-- 9. STOCK LOGS (Inventory Audits & Adjustments)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    change VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_logs_workspace ON stock_logs(workspace_id);

-- -----------------------------------------------------------------------------
-- 10. EXPENSES (Clinic Financial Outflows)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100) NOT NULL DEFAULT 'Supplies',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_workspace ON expenses(workspace_id);
CREATE INDEX idx_expenses_date ON expenses(date);

-- -----------------------------------------------------------------------------
-- 11. VACCINES (Pet Immunization Records)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    batch_number VARCHAR(100),
    administered_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    vet_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vaccines_workspace ON vaccines(workspace_id);
CREATE INDEX idx_vaccines_pet ON vaccines(pet_id);
CREATE INDEX idx_vaccines_due_date ON vaccines(due_date);

-- -----------------------------------------------------------------------------
-- 12. SHOPIFY SYNC LOGS & METAOBJECT CONTRACTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shopify_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- customer_sync, order_sync, metaobject_export
    resource_type VARCHAR(50) NOT NULL,
    shopify_id VARCHAR(100),
    petution_id VARCHAR(100),
    payload JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
