import { deleteIssue } from '../adminFunctions.js'

const testDelete = async () => {
  try {
    const deleted = await deleteIssue('bfa0dba6-e96e-40f2-bfd7-a3bc7ffec080') // 👈 Use a real issue id
    console.log("✅ Deleted issue:", deleted)
  } catch (err) {
    console.error("❌ Delete failed:", err.message)
  }
}

testDelete()
