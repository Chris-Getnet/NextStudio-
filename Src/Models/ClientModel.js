class ClientModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(clientData) {
        const { data, error } = await this.supabase
            .from('clients')
            .insert([{
                client_image_public_id: clientData.client_image?.public_id,
                client_image_url: clientData.client_image?.url
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('clients')
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

        if (updateData.client_image) {
            updateObj.client_image_public_id = updateData.client_image.public_id
            updateObj.client_image_url = updateData.client_image.url
        }

        const { data, error } = await this.supabase
            .from('clients')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('clients')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = ClientModel