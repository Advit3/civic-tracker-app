// src/lib/testUploadImage.js
import fs from 'fs'
import { uploadImage } from '../image.js'

async function testUpload() {
  try {
    // 👇 Make sure you have a file named "test.jpg" in your project root
    const fileContent = fs.readFileSync('./test.jpg')

    // 👇 Generate a unique filename each time
    const filePath = `issues/test-${Date.now()}.jpg`

    // 📤 Upload the image
    const publicUrl = await uploadImage(filePath, fileContent)

    console.log('✅ Image uploaded successfully!')
    console.log('🌐 Public URL:', publicUrl)
  } catch (err) {
    console.error('❌ Upload failed:', err)
  }
}

testUpload()
