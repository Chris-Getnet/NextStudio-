class AdminModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(adminData) {
        const { data, error } = await this.supabase
            .from('admin')
            .insert([{
                id: adminData.id,
                username: adminData.username,
                email: adminData.email,
                role: adminData.role || 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('*')
            .eq('email', email)
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async findByUsername(username) {
        const { data, error } = await this.supabase
            .from('admin')
            .select('*')
            .eq('username', username)
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
        return data
    }

    async update(id, updateData) {
        const updateObj = {
            ...updateData,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await this.supabase
            .from('admin')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('admin')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = AdminModel