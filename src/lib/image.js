// src/lib/image.js
import { supabase } from './supabaseClient.js'

/**
 * Upload an image to Supabase Storage and get its public URL
 * @param {string} filePath - storage path like 'issues/unique-name.jpg'
 * @param {Buffer | Blob} fileContent - file data read from disk or from frontend picker
 * @returns {string} public URL of uploaded image
 */
export async function uploadImage(filePath, fileContent) {
  // Upload image to the "images" bucket
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, fileContent, {
      contentType: 'image/jpeg',
      upsert: true, // overwrite if file with same name exists
    })

  if (error) throw error

  // Get the public URL of the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
