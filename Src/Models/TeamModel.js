class TeamModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(teamData) {
        const { data, error } = await this.supabase
            .from('teams')
            .insert([{
                full_name: teamData.full_name,
                work_title: teamData.work_title,
                team_image_public_id: teamData.team_image?.public_id,
                team_image_url: teamData.team_image?.url
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('teams')
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

        if (updateData.full_name) updateObj.full_name = updateData.full_name
        if (updateData.work_title) updateObj.work_title = updateData.work_title

        if (updateData.team_image) {
            updateObj.team_image_public_id = updateData.team_image.public_id
            updateObj.team_image_url = updateData.team_image.url
        }

        const { data, error } = await this.supabase
            .from('teams')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('teams')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = TeamModel