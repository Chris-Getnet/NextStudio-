class ContactModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(contactData) {
        const { data, error } = await this.supabase
            .from('contacts')
            .insert([{
                street: contactData.street,
                building: contactData.building,
                floor: contactData.floor,
                phonenumber_1: contactData.phonenumber_1,
                phonenumber_2: contactData.phonenumber_2,
                email: contactData.email,
                instagram_link: contactData.instagram_link,
                facebook_link: contactData.facebook_link,
                twitter_link: contactData.twitter_link,
                youtube_link: contactData.youtube_link
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('contacts')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async update(id, updateData) {
        const updateObj = {
            ...updateData,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await this.supabase
            .from('contacts')
            .update(updateObj)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('contacts')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = ContactModel