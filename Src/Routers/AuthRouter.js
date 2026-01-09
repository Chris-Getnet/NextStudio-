const express = require('express')
const authController = require('../Controllers/AuthController')
const { protect, requireAdmin } = require('../Middleware/authMiddleware')

const router = express.Router()

// Public routes
router.post('/signup', authController.publicSignup)  // Public user signup
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// Protected routes
router.get('/profile', protect, authController.getProfile)
router.patch('/profile', protect, authController.updateProfile)
router.patch('/password', protect, authController.updatePassword)

// Admin-only routes
router.post('/users', protect, requireAdmin, authController.createUser)  // Admin creates users
router.get('/users', protect, requireAdmin, authController.getAllUsers)  // Admin lists users
router.patch('/users/:userId/role', protect, requireAdmin, authController.updateUserRole)  // Admin updates user role
router.delete('/users/:userId', protect, requireAdmin, authController.deleteUser)  // Admin deletes user

module.exports = router
