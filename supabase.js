// ── CONNECTIT SUPABASE CONFIG ──────────────────────────
const SUPABASE_URL = 'https://vveipugwiabigzkxqfcy.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ctzp6wWO1KFbbbf6L4q8YA_olh7u1rZ'  // ← paste your key here

// ── CLIENT ─────────────────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── AUTH HELPERS ────────────────────────────────────────

// Register new user
export async function signUp(email, password, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } }
  })
  return { data, error }
}

// Login
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Logout
export async function signOut() {
  await supabase.auth.signOut()
  location.href = 'login.html'
}

// Get current logged in user
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get user role
export async function getUserRole() {
  const user = await getUser()
  if (!user) return null
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  return data?.role
}

// ── STUDENT HELPERS ─────────────────────────────────────

// Get students near a location
export async function getStudentsNearby(lat, lng, radiusMiles) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
  return { data, error }
}

// Save student profile
export async function saveStudent(profile) {
  const user = await getUser()
  const { data, error } = await supabase
    .from('students')
    .upsert({ ...profile, user_id: user.id })
  return { data, error }
}

// ── JOB HELPERS ─────────────────────────────────────────

// Get all live jobs
export async function getJobs(filters = {}) {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'live')

  if (filters.work_mode)     query = query.eq('work_mode', filters.work_mode)
  if (filters.contract_type) query = query.eq('contract_type', filters.contract_type)
  if (filters.visa)          query = query.contains('visa_accepted', [filters.visa])

  const { data, error } = await query
  return { data, error }
}

// Post a new job
export async function postJob(job) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
  return { data, error }
}

// ── APPLICATION HELPERS ─────────────────────────────────

// Apply for a job
export async function applyForJob(jobId, coverNote) {
  const user = await getUser()
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data, error } = await supabase
    .from('applications')
    .insert({
      student_id: student.id,
      job_id: jobId,
      cover_note: coverNote
    })
  return { data, error }
}

// Get applications for a recruiter
export async function getApplications(jobId) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      students(*),
      jobs(*)
    `)
    .eq('job_id', jobId)
  return { data, error }
}

// Update application status
export async function updateApplicationStatus(appId, status) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', appId)
  return { data, error }
}

// ── VENDOR HELPERS ──────────────────────────────────────

// Save vendor registration
export async function saveVendor(vendor) {
  const user = await getUser()
  const { data, error } = await supabase
    .from('vendors')
    .insert({ ...vendor, user_id: user.id })
  return { data, error }
}

// Get vendor by user
export async function getMyVendor() {
  const user = await getUser()
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', user.id)
    .single()
  return { data, error }
}