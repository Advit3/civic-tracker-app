import fs from 'fs'
import { supabase } from './supabaseClient.js'

/**
 * Upload image + create issue with full validation
 * @param {Object} payload - All issue details
 * @returns {Object} The created issue row
 */
export async function createIssueWithImageSafe(payload) {
  try {
    const {
      user_id,
      title,
      description,
      category,
      localImagePath = null,
      location_lat = null,
      location_long = null,
    } = payload

    // ✅ Step 1: Validate required fields
    if (!user_id) throw new Error("❌ user_id is missing. Make sure you're passing a valid UUID.")
    if (!title || title.trim() === '') throw new Error("❌ title is missing.")
    if (!description || description.trim() === '') throw new Error("❌ description is missing.")

    const validCategories = ['garbage', 'road', 'water', 'streetlight', 'other']
    if (!validCategories.includes(category)) {
      throw new Error(`❌ Invalid category. Must be one of: ${validCategories.join(', ')}`)
    }

    // ✅ Step 2: Upload image if provided
    let imageUrl = null
    if (localImagePath) {
      console.log("📤 Uploading image...")
      const fileContent = fs.readFileSync(localImagePath)
      const filePath = `issues/${Date.now()}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, fileContent, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
      console.log("📸 Image uploaded:", imageUrl)
    }

    // ✅ Step 3: Insert into issues table
    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          user_id,
          title,
          description,
          category,
          image_url: imageUrl,
          location_lat,
          location_long,
          status: 'pending',
        },
      ])
      .select()

    if (error) throw error

    console.log("✅ Issue created successfully:", data[0])
    return data[0]
  } catch (err) {
    console.error("❌ Failed to create issue:", err.message)
    throw err
  }
}
