const { createClient } = require('@supabase/supabase-js')
const AppError = require("../Utils/AppError")

// Create Supabase client for admin auth
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.signup = async (req,res,next)=>{
    try{
        const { email, password, username } = req.body

        if (!email || !password) {
            throw new AppError('Please provide email and password', 400)
        }

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for admin accounts
            user_metadata: {
                username: username || email.split('@')[0],
                role: 'admin'
            }
        })

        if (authError) {
            throw new AppError(authError.message, 400)
        }

        // The admin profile will be created automatically by the database trigger

        res.status(201).json({
            status: 'success',
            message: 'Admin account created successfully',
            data: {
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    username: authData.user.user_metadata.username
                }
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.login = async (req,res,next) =>{
    try{
        const { email, password } = req.body

        if(!email || !password){
            throw new AppError('Please provide email and password', 400)
        }

        // Sign in with Supabase Auth
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw new AppError('Invalid email or password', 401)
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('admin')
            .select('*')
            .eq('id', data.user.id)
            .single()

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

    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getProfile = async (req,res,next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No authorization token provided', 401)
        }

        const token = authHeader.split(' ')[1]

        // Verify the token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
            throw new AppError('Invalid or expired token', 401)
        }

        // Get admin profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('admin')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
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
            path: `/auth/v1/admin/users/${req.adminProfile.id}`,
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
            status: 'fail',
            message: error.message
        })
    }
}