import { supabase } from '../supabaseClient.js'

const testInsert = async () => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          user_id: '1a2b273f-3b83-4953-88d5-13f8e241845e',
          title: 'Manual Insert Test',
          description: 'Testing if insert works directly from Node',
          category: 'garbage',
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('❌ Insert failed:', error)
    } else {
      console.log('✅ Insert succeeded:', data)
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testInsert()
