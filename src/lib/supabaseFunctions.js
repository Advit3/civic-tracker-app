import { supabase } from './supabaseClient.js'

// ✅ 1. Add a new user
export async function addUser(name, email, role = 'citizen') {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, role }])
    .select()

  if (error) throw error
  return data[0]
}

// ✅ 2. Add a new issue (citizen reporting)
export async function addIssue({ userId, title, description, category, imageUrl = null, lat = null, long = null }) {
  const { data, error } = await supabase
    .from('issues')
    .insert([{
      user_id: userId,
      title,
      description,
      category,
      image_url: imageUrl,
      location_lat: lat,
      location_long: long,
      status: 'pending'
    }])
    .select()

  if (error) throw error
  return data[0]
}

// ✅ 3. Fetch issues by a specific user (citizen dashboard)
export async function getUserIssues(userId) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ✅ 4. Fetch all issues (admin dashboard)
export async function getAllIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ✅ 5. Update issue status (admin action)
export async function updateIssueStatus(issueId, newStatus) {
  const { data, error } = await supabase
    .from('issues')
    .update({ status: newStatus, updated_at: new Date() })
    .eq('id', issueId)
    .select()

  if (error) throw error
  return data[0]
}
