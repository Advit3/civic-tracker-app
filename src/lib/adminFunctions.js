import { supabase } from './supabaseClient.js'

/**
 * 📋 1. Fetch all issues (with reporter info)
 */
export async function getAllIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      id,
      title,
      description,
      category,
      status,
      image_url,
      location_lat,
      location_long,
      created_at,
      updated_at,
      users!user_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * 🔍 2. Fetch issues filtered by category or status
 * @param {Object} filters - { category: 'garbage', status: 'pending' }
 */
export async function getFilteredIssues({ category = null, status = null }) {
  let query = supabase.from('issues').select(`
      id,
      title,
      description,
      category,
      status,
      image_url,
      location_lat,
      location_long,
      created_at,
      updated_at,
      users!user_id (
        id,
        name,
        email
      )
  `)

  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * ✏️ 3. Update issue status (e.g., pending → resolved)
 * @param {string} issueId - UUID of the issue
 * @param {string} newStatus - 'pending', 'in_progress', 'resolved'
 */
export async function updateIssueStatus(issueId, newStatus) {
  const { data, error } = await supabase
    .from('issues')
    .update({ status: newStatus, updated_at: new Date() })
    .eq('id', issueId)
    .select()

  if (error) throw error
  return data[0]
}

/**
 * 📊 4. Count issues by status (for dashboard analytics)
 * @returns {Object} - e.g., { pending: 5, resolved: 2 }
 */
export async function getStatusCounts() {
  const { data, error } = await supabase
    .from('issues')
    .select('status')

  if (error) throw error

  const counts = data.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1
    return acc
  }, {})

  return counts
}

/**
 * 🗑️ 5. Delete an issue by ID
 * @param {string} issueId - UUID of the issue to delete
 */
export async function deleteIssue(issueId) {
  const { data, error } = await supabase
    .from('issues')
    .delete()
    .eq('id', issueId)
    .select()

  if (error) throw error
  return data[0] // returns the deleted row
}

/**
 * 📊 6. Complaints by Category
 * Returns: [{ category: 'garbage', count: 10 }, { category: 'road', count: 5 }]
 */
export async function getComplaintsByCategory() {
  const { data, error } = await supabase
    .from('issues')
    .select('category')

  if (error) throw error

  const counts = data.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).map(([category, count]) => ({ category, count }))
}

/**
 * 🏢 7. Complaints by Department
 * Auto-maps categories to departments (no separate column needed)
 * Returns: [{ department: 'Sanitation', count: 10 }, { department: 'Water Board', count: 3 }]
 */
export async function getComplaintsByDepartment() {
  const { data, error } = await supabase
    .from('issues')
    .select('category')

  if (error) throw error

  const mapping = {
    garbage: 'Sanitation',
    water: 'Water Board',
    road: 'Municipal Works',
    streetlight: 'Electrical Department',
    other: 'General Department'
  }

  const counts = data.reduce((acc, row) => {
    const dept = mapping[row.category] || 'General Department'
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).map(([department, count]) => ({ department, count }))
}
