-- Migration: Pass Management Module
-- Date: 2026-07-23
-- Note: Project currently uses TypeORM synchronize=true.
-- Keep this SQL as reference / manual apply when synchronize is disabled.

CREATE TYPE pass_entity_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE pass_tariff_type AS ENUM ('NORMAL', 'SPECIAL');
CREATE TYPE pass_status AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED');
CREATE TYPE pass_payment_type AS ENUM ('REGISTRATION', 'MONTHLY', 'REFUND', 'ADJUSTMENT');
CREATE TYPE pass_reference_month AS ENUM (
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
);

CREATE TABLE IF NOT EXISTS pass_destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status pass_entity_status NOT NULL DEFAULT 'ACTIVE',
  "createdBy" INT NULL REFERENCES users(id),
  "updatedBy" INT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS pass_categories (
  id SERIAL PRIMARY KEY,
  destination_id INT NOT NULL REFERENCES pass_destinations(id),
  name VARCHAR(100) NOT NULL,
  status pass_entity_status NOT NULL DEFAULT 'ACTIVE',
  "createdBy" INT NULL REFERENCES users(id),
  "updatedBy" INT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS pass_tariffs (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES pass_categories(id),
  name VARCHAR(150) NOT NULL,
  "tariffType" pass_tariff_type NOT NULL DEFAULT 'NORMAL',
  monthly_amount DECIMAL(15,2) NOT NULL,
  registration_fee DECIMAL(15,2) NOT NULL,
  status pass_entity_status NOT NULL DEFAULT 'ACTIVE',
  effective_from DATE NOT NULL,
  effective_to DATE NULL,
  "createdBy" INT NULL REFERENCES users(id),
  "updatedBy" INT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS passes (
  id SERIAL PRIMARY KEY,
  card_number VARCHAR(20) NOT NULL,
  card_year INT NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  identity_number VARCHAR(50) NOT NULL,
  destination_id INT NOT NULL REFERENCES pass_destinations(id),
  category_id INT NOT NULL REFERENCES pass_categories(id),
  tariff_id INT NOT NULL REFERENCES pass_tariffs(id),
  bairro VARCHAR(120) NULL,
  rua VARCHAR(120) NULL,
  quarteirao VARCHAR(50) NULL,
  casa_numero VARCHAR(50) NULL,
  andar VARCHAR(50) NULL,
  unidade VARCHAR(50) NULL,
  employer_name VARCHAR(200) NULL,
  school_name VARCHAR(200) NULL,
  school_class VARCHAR(100) NULL,
  school_number VARCHAR(50) NULL,
  school_grade VARCHAR(50) NULL,
  bairro_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
  employer_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
  school_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
  photo TEXT NULL,
  status pass_status NOT NULL DEFAULT 'ACTIVE',
  issue_date DATE NOT NULL,
  notes TEXT NULL,
  "createdBy" INT NULL REFERENCES users(id),
  "updatedBy" INT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMP NULL,
  CONSTRAINT "UQ_pass_card_number_year" UNIQUE (card_number, card_year)
);

CREATE INDEX IF NOT EXISTS "IDX_pass_full_name" ON passes(full_name);
CREATE INDEX IF NOT EXISTS "IDX_pass_identity_number" ON passes(identity_number);

CREATE TABLE IF NOT EXISTS pass_payments (
  id SERIAL PRIMARY KEY,
  pass_id INT NOT NULL REFERENCES passes(id),
  payment_type pass_payment_type NOT NULL,
  reference_month pass_reference_month NOT NULL,
  reference_year INT NOT NULL,
  monthly_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  registration_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_paid DECIMAL(15,2) NOT NULL,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  payment_date TIMESTAMPTZ NOT NULL,
  cashier_id INT NOT NULL REFERENCES users(id),
  notes TEXT NULL,
  "createdBy" INT NULL REFERENCES users(id),
  "updatedBy" INT NULL REFERENCES users(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMP NULL,
  CONSTRAINT "UQ_pass_payment_month_year_type" UNIQUE (pass_id, reference_month, reference_year, payment_type)
);

CREATE INDEX IF NOT EXISTS "IDX_pass_payment_date" ON pass_payments(payment_date);

CREATE TABLE IF NOT EXISTS pass_card_sequences (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  CONSTRAINT "UQ_pass_card_sequence_year" UNIQUE (year)
);

CREATE TABLE IF NOT EXISTS pass_receipt_sequences (
  id SERIAL PRIMARY KEY,
  prefix VARCHAR(20) NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  CONSTRAINT "UQ_pass_receipt_sequence_prefix" UNIQUE (prefix)
);
