require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkData() {
  console.log('🔍 Checking UUIDs in Supabase...\n')

  const tables = ['videos', 'quotes', 'contacts', 'abouts']

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(5)

      if (error) {
        console.error(`❌ Error checking ${table}:`, error.message)
      } else {
        console.log(`${table.toUpperCase()}:`)
        data.forEach(item => console.log(`  ID: ${item.id}`))
        console.log()
      }
    } catch (err) {
      console.error(`❌ Error with ${table}:`, err.message)
    }
  }
}

checkData()




