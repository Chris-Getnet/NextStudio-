class PortfolioModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(portfolioData) {
        // Start a transaction by inserting the main portfolio data
        const { data: portfolio, error: portfolioError } = await this.supabase
            .from('portfolios')
            .insert([{
                company_name: portfolioData.company_name,
                project_name: portfolioData.project_name,
                project_category: portfolioData.project_category,
                project_description1: portfolioData.project_description1,
                project_date: portfolioData.project_date
            }])
            .select()
            .single()

        if (portfolioError) throw portfolioError

        const portfolioId = portfolio.id

        // Insert images if provided
        if (portfolioData.project_image && portfolioData.project_image.length > 0) {
            const imageInserts = portfolioData.project_image.map(img => ({
                portfolio_id: portfolioId,
                public_id: img.public_id,
                url: img.url
            }))

            const { error: imageError } = await this.supabase
                .from('portfolio_images')
                .insert(imageInserts)

            if (imageError) throw imageError
        }

        // Insert videos if provided (supporting multiple videos now)
        if (portfolioData.project_videos && portfolioData.project_videos.length > 0) {
            const videoInserts = portfolioData.project_videos.map(video => ({
                portfolio_id: portfolioId,
                video_url: video
            }))

            const { error: videoError } = await this.supabase
                .from('portfolio_videos')
                .insert(videoInserts)

            if (videoError) throw videoError
        }

        return await this.findById(portfolioId)
    }

    async findAll() {
        const { data: portfolios, error } = await this.supabase
            .from('portfolios')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        // Get images and videos for each portfolio
        const portfoliosWithMedia = await Promise.all(
            portfolios.map(async (portfolio) => {
                const [images, videos] = await Promise.all([
                    this.getPortfolioImages(portfolio.id),
                    this.getPortfolioVideos(portfolio.id)
                ])

                return {
                    ...portfolio,
                    project_image: images,
                    project_videos: videos.map(v => v.video_url)
                }
            })
        )

        return portfoliosWithMedia
    }

    async findById(id) {
        const { data: portfolio, error } = await this.supabase
            .from('portfolios')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        // Get associated images and videos
        const [images, videos] = await Promise.all([
            this.getPortfolioImages(id),
            this.getPortfolioVideos(id)
        ])

        return {
            ...portfolio,
            project_image: images,
            project_videos: videos.map(v => v.video_url)
        }
    }

    async getPortfolioImages(portfolioId) {
        const { data, error } = await this.supabase
            .from('portfolio_images')
            .select('public_id, url')
            .eq('portfolio_id', portfolioId)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data || []
    }

    async getPortfolioVideos(portfolioId) {
        const { data, error } = await this.supabase
            .from('portfolio_videos')
            .select('video_url')
            .eq('portfolio_id', portfolioId)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data || []
    }

    async update(id, updateData) {
        const updateObj = {
            updated_at: new Date().toISOString()
        }

        if (updateData.company_name) updateObj.company_name = updateData.company_name
        if (updateData.project_name) updateObj.project_name = updateData.project_name
        if (updateData.project_category) updateObj.project_category = updateData.project_category
        if (updateData.project_description1) updateObj.project_description1 = updateData.project_description1
        if (updateData.project_date) updateObj.project_date = updateData.project_date

        const { data, error } = await this.supabase
            .from('portfolios')
            .update(updateObj)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        // Update images if provided
        if (updateData.project_image !== undefined) {
            // Delete existing images
            await this.supabase
                .from('portfolio_images')
                .delete()
                .eq('portfolio_id', id)

            // Insert new images
            if (updateData.project_image.length > 0) {
                const imageInserts = updateData.project_image.map(img => ({
                    portfolio_id: id,
                    public_id: img.public_id,
                    url: img.url
                }))

                const { error: imageError } = await this.supabase
                    .from('portfolio_images')
                    .insert(imageInserts)

                if (imageError) throw imageError
            }
        }

        // Update videos if provided
        if (updateData.project_videos !== undefined) {
            // Delete existing videos
            await this.supabase
                .from('portfolio_videos')
                .delete()
                .eq('portfolio_id', id)

            // Insert new videos
            if (updateData.project_videos.length > 0) {
                const videoInserts = updateData.project_videos.map(video => ({
                    portfolio_id: id,
                    video_url: video
                }))

                const { error: videoError } = await this.supabase
                    .from('portfolio_videos')
                    .insert(videoInserts)

                if (videoError) throw videoError
            }
        }

        return await this.findById(id)
    }

    async delete(id) {
        // Delete portfolio (cascade will handle images and videos)
        const { error } = await this.supabase
            .from('portfolios')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = PortfolioModel