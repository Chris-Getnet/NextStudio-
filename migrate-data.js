require('dotenv').config()
const mongoose = require('mongoose')
const { createClient } = require('@supabase/supabase-js')

// Use service role for migration (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const mongoDbUri = process.env.MONGODB_URI

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role credentials')
}

if (!mongoDbUri) {
    throw new Error('Missing MongoDB URI environment variable')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function exportFromMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoDbUri)
        console.log('✅ Connected to MongoDB')

        // Export each collection
        const collections = {
            admins: await mongoose.connection.db.collection('admins').find({}).toArray(),
            services: await mongoose.connection.db.collection('services').find({}).toArray(),
            portfolios: await mongoose.connection.db.collection('portfolios').find({}).toArray(),
            contacts: await mongoose.connection.db.collection('contacts').find({}).toArray(),
            teams: await mongoose.connection.db.collection('teams').find({}).toArray(),
            abouts: await mongoose.connection.db.collection('abouts').find({}).toArray(),
            clients: await mongoose.connection.db.collection('clients').find({}).toArray(),
            quotes: await mongoose.connection.db.collection('quotes').find({}).toArray(),
            videos: await mongoose.connection.db.collection('videos').find({}).toArray(),
        }

        await mongoose.disconnect()
        console.log('✅ Disconnected from MongoDB')

        return collections
    } catch (error) {
        console.error('❌ MongoDB export failed:', error)
        process.exit(1)
    }
}

async function transformData(collections) {
    console.log('🔄 Transforming data...')

    // Transform portfolios to support multiple videos
    const transformedPortfolios = collections.portfolios.map(portfolio => ({
        company_name: portfolio.company_name,
        project_name: portfolio.project_name,
        project_category: portfolio.project_category,
        project_description1: portfolio.project_description1,
        project_date: portfolio.project_date,
        project_image: portfolio.project_image || [],
        project_videos: portfolio.project_video ? [portfolio.project_video] : [] // Convert single video to array
    }))

    return {
        ...collections,
        portfolios: transformedPortfolios
    }
}

async function importToSupabase(transformedData) {
    console.log('📥 Importing to Supabase...')

    try {
        // Import Admin data
        if (transformedData.admins && transformedData.admins.length > 0) {
            console.log('Importing admin data...')
            const adminInserts = transformedData.admins.map(admin => ({
                username: admin.username,
                password: admin.password
            }))
            const { error } = await supabase.from('admin').insert(adminInserts)
            if (error) throw error
            console.log('✅ Admin data imported')
        }

        // Import Services
        if (transformedData.services && transformedData.services.length > 0) {
            console.log('Importing service data...')
            const serviceInserts = transformedData.services.map(service => ({
                service_title: service.service_title,
                service_description: service.service_description,
                service_icon_public_id: service.service_icon?.public_id,
                service_icon_url: service.service_icon?.url
            }))
            const { error } = await supabase.from('services').insert(serviceInserts)
            if (error) throw error
            console.log('✅ Service data imported')
        }

        // Import Portfolios and related data
        if (transformedData.portfolios && transformedData.portfolios.length > 0) {
            console.log('Importing portfolio data...')
            for (const portfolio of transformedData.portfolios) {
                // Insert portfolio
                const { data: portfolioData, error: portfolioError } = await supabase
                    .from('portfolios')
                    .insert([{
                        company_name: portfolio.company_name,
                        project_name: portfolio.project_name,
                        project_category: portfolio.project_category,
                        project_description1: portfolio.project_description1,
                        project_date: portfolio.project_date
                    }])
                    .select()
                    .single()

                if (portfolioError) throw portfolioError

                const portfolioId = portfolioData.id

                // Insert images
                if (portfolio.project_image && portfolio.project_image.length > 0) {
                    const imageInserts = portfolio.project_image.map(img => ({
                        portfolio_id: portfolioId,
                        public_id: img.public_id,
                        url: img.url
                    }))
                    const { error: imageError } = await supabase.from('portfolio_images').insert(imageInserts)
                    if (imageError) throw imageError
                }

                // Insert videos
                if (portfolio.project_videos && portfolio.project_videos.length > 0) {
                    const videoInserts = portfolio.project_videos.map(video => ({
                        portfolio_id: portfolioId,
                        video_url: video
                    }))
                    const { error: videoError } = await supabase.from('portfolio_videos').insert(videoInserts)
                    if (videoError) throw videoError
                }
            }
            console.log('✅ Portfolio data imported')
        }

        // Import Contacts
        if (transformedData.contacts && transformedData.contacts.length > 0) {
            console.log('Importing contact data...')
            const contactInserts = transformedData.contacts.map(contact => ({
                street: contact.street,
                building: contact.building,
                floor: contact.floor,
                phonenumber_1: contact.phonenumber_1,
                phonenumber_2: contact.phonenumber_2,
                email: contact.email,
                instagram_link: contact.instagram_link,
                facebook_link: contact.facebook_link,
                twitter_link: contact.twitter_link,
                youtube_link: contact.youtube_link
            }))
            const { error } = await supabase.from('contacts').insert(contactInserts)
            if (error) throw error
            console.log('✅ Contact data imported')
        }

        // Import Teams
        if (transformedData.teams && transformedData.teams.length > 0) {
            console.log('Importing team data...')
            const teamInserts = transformedData.teams.map(team => ({
                full_name: team.full_name,
                work_title: team.work_title,
                team_image_public_id: team.team_image?.public_id,
                team_image_url: team.team_image?.url
            }))
            const { error } = await supabase.from('teams').insert(teamInserts)
            if (error) throw error
            console.log('✅ Team data imported')
        }

        // Import About
        if (transformedData.abouts && transformedData.abouts.length > 0) {
            console.log('Importing about data...')
            const aboutInserts = transformedData.abouts.map(about => ({
                intro_image_public_id: about.intro_image?.public_id,
                intro_image_url: about.intro_image?.url,
                about_desc: about.about_desc
            }))
            const { error } = await supabase.from('abouts').insert(aboutInserts)
            if (error) throw error
            console.log('✅ About data imported')
        }

        // Import Clients
        if (transformedData.clients && transformedData.clients.length > 0) {
            console.log('Importing client data...')
            const clientInserts = transformedData.clients.map(client => ({
                client_image_public_id: client.client_image?.public_id,
                client_image_url: client.client_image?.url
            }))
            const { error } = await supabase.from('clients').insert(clientInserts)
            if (error) throw error
            console.log('✅ Client data imported')
        }

        // Import Quotes
        if (transformedData.quotes && transformedData.quotes.length > 0) {
            console.log('Importing quote data...')
            const quoteInserts = transformedData.quotes.map(quote => ({
                quote_text: quote.quote_text
            }))
            const { error } = await supabase.from('quotes').insert(quoteInserts)
            if (error) throw error
            console.log('✅ Quote data imported')
        }

        // Import Videos
        if (transformedData.videos && transformedData.videos.length > 0) {
            console.log('Importing video data...')
            const videoInserts = transformedData.videos.map(video => ({
                banner_video_public_id: video.banner_video?.public_id,
                banner_video_url: video.banner_video?.url
            }))
            const { error } = await supabase.from('videos').insert(videoInserts)
            if (error) throw error
            console.log('✅ Video data imported')
        }

        console.log('🎉 All data migrated successfully!')

    } catch (error) {
        console.error('❌ Supabase import failed:', error)
        throw error
    }
}

async function migrateData() {
    try {
        console.log('🚀 Starting data migration from MongoDB to Supabase...')

        // Step 1: Export from MongoDB
        const mongoData = await exportFromMongoDB()

        // Step 2: Transform data
        const transformedData = await transformData(mongoData)

        // Step 3: Import to Supabase
        await importToSupabase(transformedData)

        console.log('✅ Migration completed successfully!')
        console.log('📊 Summary:')
        Object.keys(transformedData).forEach(key => {
            const count = transformedData[key]?.length || 0
            console.log(`   ${key}: ${count} records`)
        })

    } catch (error) {
        console.error('❌ Migration failed:', error.message)
        process.exit(1)
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateData()
}

module.exports = migrateData