import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// User types
export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  role: 'admin' | 'company' | 'contractor'
  phone?: string
  created_at: Date
  updated_at: Date
}

export interface Company {
  id: string
  user_id: string
  company_name: string
  address?: string
  city?: string
  state?: string
  zip?: string
  description?: string
  website?: string
  created_at: Date
  updated_at: Date
}

export interface Contractor {
  id: string
  user_id: string
  business_name?: string
  specialty?: string
  license_number?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  bio?: string
  hourly_rate?: number
  years_experience?: number
  rating?: number
  total_reviews?: number
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  company_id: string
  title: string
  description?: string
  category?: string
  budget_min?: number
  budget_max?: number
  location?: string
  city?: string
  state?: string
  deadline?: Date
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
  created_at: Date
  updated_at: Date
}

export interface Bid {
  id: string
  project_id: string
  contractor_id: string
  amount: number
  proposal?: string
  timeline?: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: Date
  updated_at: Date
}

export interface Job {
  id: string
  company_id: string
  title: string
  description?: string
  category?: string
  job_type?: string
  salary_min?: number
  salary_max?: number
  location?: string
  requirements?: string
  status: 'open' | 'closed' | 'filled'
  created_at: Date
  updated_at: Date
}
