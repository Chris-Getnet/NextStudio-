const { createClient } = require('@supabase/supabase-js')
const AppError = require('../Utils/AppError')

// Create Supabase client for auth verification
const supabaseAuth = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

// Create Supabase admin client for admin operations
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.protect = async (req, res, next) => {
    try{
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('You are not logged in! Please provide authorization token.', 401)
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAuth.auth.getUser(token)

        if (error || !user) {
            throw new AppError('Invalid or expired token', 401)
        }

        req.user = user;
        next();

    } catch(err){
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('Authentication required', 401)
        }

        // Check if user has admin role
        const userRole = req.user.user_metadata?.role || req.user.app_metadata?.role

        if (userRole !== 'admin') {
            throw new AppError('Access denied. Admin privileges required.', 403)
        }

        // Optional: Check admin profile exists
        const { data: adminProfile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .eq('role', 'admin')
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Admin profile check error:', profileError)
        }

        req.adminProfile = adminProfile;
        next();

    } catch(err){
        res.status(err.statusCode || 403).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.requireUser = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('Authentication required', 401)
        }

        next();

    } catch(err){
        res.status(err.statusCode || 401).json({
            status: 'fail',
            message: err.message
        })
    }
}