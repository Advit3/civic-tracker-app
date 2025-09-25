import { createIssueWithImage } from '../combinedFunctions.js'

const test = async () => {
  try {
    const result = await createIssueWithImage({
      userId: '1a2b273f-3b83-4953-88d5-13f8e241845e', // must be a valid UUID from `users` table
      title: 'Illegal dumping of garbage',
      description: 'Someone is dumping waste near the park entrance.',
      category: 'garbage',
      localImagePath: './test.jpg', // make sure this file exists in project root
      lat: 18.5204,
      long: 73.8567,
    })

    console.log('✅ Final result:', result)
  } catch (err) {
    console.error('❌ Test failed:', err)
  }
}

test()
