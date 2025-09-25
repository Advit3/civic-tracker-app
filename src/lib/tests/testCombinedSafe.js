import { createIssueWithImageSafe } from '../combinedSafeCreate.js'

const test = async () => {
  try {
    const newIssue = await createIssueWithImageSafe({
      user_id: '1a2b273f-3b83-4953-88d5-13f8e241845e', // 👈 real user UUID
      title: 'Water leakage from main pipe',
      description: 'Continuous leakage observed near block 7 main road.',
      category: 'water',
      localImagePath: './test.jpg', // 👈 must exist in project root
      location_lat: 18.5204,
      location_long: 73.8567,
    })

    console.log("✅ Final issue object:", newIssue)
  } catch (err) {
    console.error("❌ Test failed:", err.message)
  }
}

test()
