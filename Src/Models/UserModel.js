class UserModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(userData) {
        const { data, error } = await this.supabase
            .from('users')
            .insert([{
                id: userData.id,
                email: userData.email,
                full_name: userData.full_name || '',
                avatar_url: userData.avatar_url || '',
                role: userData.role || 'user'
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    }

    async findByRole(role) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('role', role)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async update(id, updateData) {
        const updateObj = {
            ...updateData,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await this.supabase
            .from('users')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('users')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = UserModel


