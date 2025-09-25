import { getAllIssues, getFilteredIssues, updateIssueStatus, getStatusCounts } from '../adminFunctions.js'

const testAdmin = async () => {
  try {
    console.log("📋 All Issues:")
    console.log(await getAllIssues())

    console.log("🔍 Filtered Issues (garbage):")
    console.log(await getFilteredIssues({ category: 'garbage' }))

    console.log("✏️ Updating status of one issue:")
    console.log(await updateIssueStatus('c8ec0b63-5736-462f-8e80-6a16059b8bc8', 'resolved'))

    console.log("📊 Status counts:")
    console.log(await getStatusCounts())
  } catch (err) {
    console.error("❌ Admin test failed:", err.message)
  }
}

testAdmin()
