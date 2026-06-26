const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envFile = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf-8')
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && v.length) process.env[k.trim()] = v.join('=').trim()
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const artDir = path.resolve(__dirname, '../public/art')
const files = fs.readdirSync(artDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).sort()

async function importArt() {
  console.log(`Found ${files.length} images in public/art/`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const title = `Artwork ${i + 1}`
    const image_url = `/art/${file}`
    const medium = 'Photography'

    const { data, error } = await supabaseAdmin
      .from('art_posts')
      .insert([{ title, description: null, image_url, medium }])
      .select()

    if (error) {
      console.error(`Failed to insert ${file}: ${error.message}`)
    } else {
      console.log(`✅ ${i + 1}. ${file} -> "${title}" (${medium})`)
    }
  }

  console.log('\nDone! All artworks imported.')
}

importArt().catch(console.error)
