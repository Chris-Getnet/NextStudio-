class QuoteModel {
    constructor(supabase) {
        this.supabase = supabase
    }

    async create(quoteData) {
        const { data, error } = await this.supabase
            .from('quotes')
            .insert([{
                quote_text: quoteData.quote_text
            }])
            .select()

        if (error) throw error
        return data[0]
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async update(id, updateData) {
        const { data, error } = await this.supabase
            .from('quotes')
            .update({
                quote_text: updateData.quote_text,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    }

    async delete(id) {
        const { error } = await this.supabase
            .from('quotes')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

module.exports = QuoteModel