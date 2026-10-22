
import { supabase } from './lib/supabase'

async function testConnection() {
  const { error } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)

  if (error) {
    console.error('Supabase connection/query error:', error.message)
  } else {
    console.log('Supabase connected successfully!')
  }
}

testConnection()
