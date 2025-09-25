import fs from 'fs'
import { supabase } from './supabaseClient.js'

/**
 * Upload an image + create a new issue in one step.
 * @param {string} userId - UUID of the user
 * @param {string} title - Title of the issue
 * @param {string} description - Description of the issue
 * @param {string} category - Category ('road', 'garbage', 'streetlight', 'water', 'other')
 * @param {string} localImagePath - Local path of the image (e.g., './test.jpg')
 * @param {number} lat - Latitude (optional)
 * @param {number} long - Longitude (optional)
 */
export async function createIssueWithImage({
  userId,
  title,
  description,
  category,
  localImagePath,
  lat = null,
  long = null,
}) {
  try {
    let imageUrl = null

    // ✅ 1. Upload image if provided
    if (localImagePath) {
      const fileContent = fs.readFileSync(localImagePath)
      const filePath = `issues/${Date.now()}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, fileContent, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // ✅ 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
      console.log('📸 Image uploaded at:', imageUrl)
    }

    // ✅ 3. Insert new issue in database
    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          user_id: userId,
          title,
          description,
          category,
          image_url: imageUrl,
          location_lat: lat,
          location_long: long,
          status: 'pending',
        },
      ])
      .select()

    if (error) throw error

    console.log('✅ Issue created successfully:', data[0])
    return data[0]
  } catch (err) {
    console.error('❌ Failed to create issue with image:', err)
    throw err
  }
}
