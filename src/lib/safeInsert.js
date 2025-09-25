import { supabase } from './supabaseClient.js'

/**
 * Safely create a new issue with validation
 * @param {Object} issueData - The issue details
 * @returns {Object} - Inserted issue row or error message
 */
export async function safeAddIssue(issueData) {
  const { user_id, title, description, category, image_url = null, location_lat = null, location_long = null } = issueData

  // ✅ Step 1: Validate required fields
  if (!user_id) throw new Error("❌ user_id is missing. Make sure you're passing the correct UUID.")
  if (!title || title.trim() === "") throw new Error("❌ title is missing.")
  if (!description || description.trim() === "") throw new Error("❌ description is missing.")

  const validCategories = ['garbage', 'road', 'water', 'streetlight', 'other']
  if (!validCategories.includes(category)) {
    throw new Error(`❌ Invalid category. Must be one of: ${validCategories.join(', ')}`)
  }

  // ✅ Step 2: Insert into Supabase
  const { data, error } = await supabase
    .from('issues')
    .insert([{
      user_id,
      title,
      description,
      category,
      image_url,
      location_lat,
      location_long,
      status: 'pending'
    }])
    .select()

  // ✅ Step 3: Handle DB errors clearly
  if (error) {
    console.error("❌ Supabase insert error:", error)
    throw new Error(`❌ Database insert failed: ${error.message}`)
  }

  console.log("✅ Issue created successfully:", data[0])
  return data[0]
}
