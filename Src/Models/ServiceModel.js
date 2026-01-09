class ServiceModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(serviceData) {
        const { data, error } = await this.supabase
            .from('services')
            .insert([{
                service_title: serviceData.service_title,
                service_description: serviceData.service_description,
                service_icon_public_id: serviceData.service_icon?.public_id,
                service_icon_url: serviceData.service_icon?.url
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async update(id, updateData) {
        const updateObj = {
            service_title: updateData.service_title,
            service_description: updateData.service_description,
            updated_at: new Date().toISOString()
        }

        if (updateData.service_icon) {
            updateObj.service_icon_public_id = updateData.service_icon.public_id
            updateObj.service_icon_url = updateData.service_icon.url
        }

        const { data, error } = await this.supabase
            .from('services')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('services')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = ServiceModel