const supabase = require('../Config/database')

// Initialize all models with supabase client
const AdminModel = require('./AdminModel')
const ServiceModel = require('./ServiceModel')
const PortfolioModel = require('./PortfolioModel')
const ContactModel = require('./ContactModel')
const TeamModel = require('./TeamModel')
const AboutModel = require('./AboutModel')
const ClientModel = require('./ClientModel')
const QuoteModel = require('./QuoteModel')
const VideoModel = require('./VideoModel')
const UserModel = require('./UserModel')

// Export initialized model instances
module.exports = {
    Admin: new AdminModel(supabase),
    Service: new ServiceModel(supabase),
    Portfolio: new PortfolioModel(supabase),
    Contact: new ContactModel(supabase),
    Team: new TeamModel(supabase),
    About: new AboutModel(supabase),
    Client: new ClientModel(supabase),
    Quote: new QuoteModel(supabase),
    Video: new VideoModel(supabase),
    User: new UserModel(supabase)
}


