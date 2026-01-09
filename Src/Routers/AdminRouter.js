const express = require('express')
const adminController = require('../Controllers/AdminController')

const { protect, requireAdmin } = require('../Middleware/authMiddleware')

const router = express.Router()

router.post('/signup', adminController.signup)
router.post('/login', adminController.login)
router.get('/profile', protect, requireAdmin, adminController.getProfile)
router.patch('/password', protect, requireAdmin, adminController.updatePassword)

module.exports = router