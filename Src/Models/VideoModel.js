class VideoModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(videoData) {
        const { data, error } = await this.supabase
            .from('videos')
            .insert([{
                banner_video_public_id: videoData.banner_video?.public_id,
                banner_video_url: videoData.banner_video?.url
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('videos')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async update(id, updateData) {
        const updateObj = {
            updated_at: new Date().toISOString()
        }

        if (updateData.banner_video) {
            updateObj.banner_video_public_id = updateData.banner_video.public_id
            updateObj.banner_video_url = updateData.banner_video.url
        }

        const { data, error } = await this.supabase
            .from('videos')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('videos')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = VideoModel