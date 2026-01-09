const express = require('express')
const portfolioController =  require('../Controllers/PortfolioController')


const { protect } = require('../Middleware/authMiddleware')

const router = express.Router()

router
    .route('/')
    .post(protect,portfolioController.CreatePortfolio)
    .get(portfolioController.getPortfolio)

router
    .route('/length')
    .get(portfolioController.getAllPortfolio)

router
    .route('/:id')
    .get(portfolioController.getPortfolioById)
    .patch(protect,portfolioController.updatePortfolios)
    .delete(protect,portfolioController.deletePortfolio)

router
    .route('/image/:id')
    .patch(protect,portfolioController.addPortfolioImages)
    
router
    .route('/:id/:id1')
    .delete(protect,portfolioController.deletePortfolioImage)


module.exports = router