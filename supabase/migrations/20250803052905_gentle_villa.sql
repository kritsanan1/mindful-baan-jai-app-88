/*
  # Stripe Integration Tables

  1. New Tables
    - `customers`
      - Links Supabase users to Stripe customers
      - `id` (uuid, references auth.users)
      - `stripe_customer_id` (text, Stripe customer ID)
    
    - `products` 
      - Stripe products information
      - `id` (text, Stripe product ID)
      - `name` (text)
      - `description` (text)
      - `active` (boolean)
      - `metadata` (jsonb)
      - `image` (text, product image URL)
    
    - `prices`
      - Stripe price information
      - `id` (text, Stripe price ID)
      - `product_id` (text, references products)
      - `active` (boolean)
      - `currency` (text)
      - `unit_amount` (bigint, price in cents)
      - `type` (enum: one_time, recurring)
      - `interval` (enum: day, week, month, year)
      - `interval_count` (integer)
      - `trial_period_days` (integer)
      - `metadata` (jsonb)
    
    - `subscriptions`
      - User subscription information
      - `id` (text, Stripe subscription ID)
      - `user_id` (uuid, references auth.users)
      - `status` (enum: trialing, active, canceled, etc.)
      - `price_id` (text, references prices)
      - `quantity` (integer)
      - `cancel_at_period_end` (boolean)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created` (timestamptz)
      - `canceled_at` (timestamptz)
      - `cancel_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `trial_start` (timestamptz)
      - `trial_end` (timestamptz)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for service role to manage all data
*/

-- Create custom types
CREATE TYPE pricing_type AS ENUM ('one_time', 'recurring');
CREATE TYPE pricing_plan_interval AS ENUM ('day', 'week', 'month', 'year');
CREATE TYPE subscription_status AS ENUM (
  'trialing',
  'active', 
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid'
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own customer data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  active boolean DEFAULT true,
  name text,
  description text,
  image text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Prices table  
CREATE TABLE IF NOT EXISTS prices (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  description text,
  unit_amount bigint,
  currency text DEFAULT 'thb',
  type pricing_type DEFAULT 'recurring',
  interval pricing_plan_interval,
  interval_count integer DEFAULT 1,
  trial_period_days integer,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prices are viewable by everyone"
  ON prices
  FOR SELECT
  TO authenticated
  USING (true);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status subscription_status,
  metadata jsonb DEFAULT '{}'::jsonb,
  price_id text REFERENCES prices(id),
  quantity integer DEFAULT 1,
  cancel_at_period_end boolean DEFAULT false,
  created timestamptz DEFAULT now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription data"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users table (for Stripe customer portal)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own user data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);