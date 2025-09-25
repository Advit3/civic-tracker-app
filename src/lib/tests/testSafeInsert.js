import { safeAddIssue } from '../safeInsert.js'

const test = async () => {
  try {
    const result = await safeAddIssue({
      user_id: '1a2b273f-3b83-4953-88d5-13f8e241845e', // ✅ <-- in quotes now
      title: 'Overflowing garbage bin',
      description: 'Garbage bin near main road has been overflowing for 2 days',
      category: 'garbage',
      image_url: 'https://example.com/test.jpg', // optional
      location_lat: 18.5204,
      location_long: 73.8567
    })

    console.log("✅ Final result:", result)
  } catch (err) {
    console.error(err.message)
  }
}

test()
