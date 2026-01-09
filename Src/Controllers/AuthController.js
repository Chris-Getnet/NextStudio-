const { createClient } = require('@supabase/supabase-js')
const { User } = require('../Models')
const AppError = require('../Utils/AppError')

// Create Supabase client for user auth
const supabaseAuth = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

// Create Supabase admin client for admin operations
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Public signup for regular users (no admin role)
exports.publicSignup = async (req, res, next) => {
    try {
        const { email, password, full_name, avatar_url } = req.body

        if (!email || !password) {
            throw new AppError('Please provide email and password', 400)
        }

        // Force role to 'user' for public signup
        const userRole = 'user'

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || '',
                    avatar_url: avatar_url || '',
                    role: userRole
                }
            }
        })

        if (authError) {
            throw new AppError(authError.message, 400)
        }

        res.status(201).json({
            status: 'success',
            message: 'Account created successfully. Please check your email to confirm your account.',
            data: {
                user: {
                    id: authData.user?.id,
                    email: authData.user?.email,
                    role: userRole,
                    confirmed_at: authData.user?.confirmed_at
                }
            }
        })

    } catch (error) {
        console.error('Signup error:', error)
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Something went wrong during signup'
        })
    }
}

// Admin-only user creation
exports.createUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authorization token provided', 401)
        }

        const token = authHeader.split(' ')[1]

        // Verify admin token
        const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !adminUser) {
            throw new AppError('Invalid admin token', 401)
        }

        // Check if requester is admin
        const adminRole = adminUser.user_metadata?.role || adminUser.app_metadata?.role
        if (adminRole !== 'admin') {
            throw new AppError('Access denied. Admin privileges required.', 403)
        }

        const { email, password, full_name, avatar_url, role } = req.body

        if (!email || !password) {
            throw new AppError('Please provide email and password', 400)
        }

        // Validate role (only admins can create admin users)
        const allowedRoles = ['user', 'admin']
        const userRole = role || 'user'

        if (!allowedRoles.includes(userRole)) {
            throw new AppError('Invalid role specified', 400)
        }

        // Create user with Supabase Admin API (bypasses email confirmation)
        const { data: authData, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for admin-created accounts
            user_metadata: {
                full_name: full_name || '',
                avatar_url: avatar_url || '',
                role: userRole,
                created_by: adminUser.id // Track who created this user
            }
        })

        if (authError2) {
            throw new AppError(authError2.message, 400)
        }

        res.status(201).json({
            status: 'success',
            message: `${userRole === 'admin' ? 'Admin' : 'User'} account created successfully`,
            data: {
                user: {
                    id: authData.user?.id,
                    email: authData.user?.email,
                    role: userRole,
                    full_name: full_name || '',
                    created_by: adminUser.id
                }
            }
        })

    } catch (error) {
        console.error('User creation error:', error)
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Something went wrong during user creation'
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new AppError('Please provide email and password', 400)
        }

        const { data, error } = await supabaseAuth.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw new AppError('Invalid email or password', 401)
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabaseAuth
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError)
        }

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                user: data.user,
                profile: profile || null,
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at
                }
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

exports.logout = async (req, res, next) => {
    try {
        const { error } = await supabaseAuth.auth.signOut()

        if (error) {
            throw new AppError('Error logging out', 500)
        }

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authorization token provided', 401)
        }

        const token = authHeader.split(' ')[1]

        // Verify the token with Supabase
        const { data: { user }, error } = await supabaseAuth.auth.getUser(token)

        if (error || !user) {
            throw new AppError('Invalid or expired token', 401)
        }

        // Get additional user profile data
        const { data: profile, error: profileError } = await supabaseAuth
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError)
        }

        res.status(200).json({
            status: 'success',
            data: {
                user,
                profile: profile || null
            }
        })

    } catch (error) {
        res.status(error.statusCode || 401).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authorization token provided', 401)
        }

        const token = authHeader.split(' ')[1]
        const { full_name, avatar_url } = req.body

        // Get current user
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

        if (authError || !user) {
            throw new AppError('Not authenticated', 401)
        }

        // Update user profile
        const { data, error } = await supabaseAuth
            .from('users')
            .update({
                full_name: full_name || user.user_metadata?.full_name,
                avatar_url: avatar_url || user.user_metadata?.avatar_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            throw new AppError('Failed to update profile', 500)
        }

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: data
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authorization token provided', 401)
        }

        const token = authHeader.split(' ')[1]
        const { oldPassword, newPassword, confirmPassword } = req.body

        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new AppError('Old password, new password, and confirm password are required', 400)
        }

        if (newPassword !== confirmPassword) {
            throw new AppError('New password and confirm password do not match', 400)
        }

        // Update password using Supabase Admin REST API
        const https = require('https')

        const postData = JSON.stringify({
            password: newPassword
        })

        const options = {
            hostname: process.env.SUPABASE_URL.replace('https://', ''),
            path: `/auth/v1/admin/users/${req.user.id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
            }
        }

        const result = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = ''
                res.on('data', (chunk) => {
                    data += chunk
                })
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data)
                        resolve({ data: response, error: null })
                    } catch (e) {
                        resolve({ data: null, error: { message: 'Failed to parse response' } })
                    }
                })
            })

            req.on('error', (error) => {
                reject(error)
            })

            req.write(postData)
            req.end()
        })

        if (result.error || (result.data && result.data.error)) {
            const errorMsg = result.error ? result.error.message : (result.data.error?.message || 'Unknown error')
            throw new AppError(`Password update failed: ${errorMsg}`, 400)
        }

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

// Admin-only user management
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, page = 1, limit = 10 } = req.query

        let query = supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        // Filter by role if specified
        if (role) {
            query = query.eq('role', role)
        }

        // Pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: users, error, count } = await query

        if (error) {
            throw new AppError('Failed to fetch users', 500)
        }

        res.status(200).json({
            status: 'success',
            results: users.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count
            },
            data: {
                users
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

exports.updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { role } = req.body

        if (!userId || !role) {
            throw new AppError('User ID and role are required', 400)
        }

        const allowedRoles = ['user', 'admin']
        if (!allowedRoles.includes(role)) {
            throw new AppError('Invalid role specified', 400)
        }

        // Update user metadata in Supabase Auth
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: {
                role: role
            }
        })

        if (error) {
            throw new AppError(error.message, 400)
        }

        // Update role in users table
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .update({ role })
            .eq('id', userId)
            .select()
            .single()

        if (userError) {
            console.error('User table update error:', userError)
        }

        res.status(200).json({
            status: 'success',
            message: `User role updated to ${role}`,
            data: {
                user: userData || data.user
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params

        if (!userId) {
            throw new AppError('User ID is required', 400)
        }

        // Delete from Supabase Auth (this will cascade to users table via foreign key)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) {
            throw new AppError(error.message, 400)
        }

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        })
    }
}
