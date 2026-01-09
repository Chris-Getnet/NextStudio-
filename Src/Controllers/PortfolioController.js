const { Portfolio } = require('../Models')
const cloudinary = require('../Utils/cloudinary')


exports.CreatePortfolio = async (req,res,next) => {

    try {
        let images = [...req.body.project_image];
        let imagesBuffer = [];

        if (images.length > 5) {
            return res.status(400).json({
                status: 'fail',
                messages: 'Maximum allowed number of images is 5.'
            });
        }

        for (let i =0; i < images.length;  i++){
            const result = await cloudinary.uploader.upload(images[i], {
                upload_preset: "NextPortfolio",
                width: 1600
            });

            imagesBuffer.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        }

        // Handle videos - now supporting multiple videos
        let videos = req.body.project_videos || [];

        const portfolioData = {
            company_name: req.body.company_name,
            project_name: req.body.project_name,
            project_category: req.body.project_category,
            project_description1: req.body.project_description1,
            project_date: req.body.project_date,
            project_image: imagesBuffer,
            project_videos: videos
        }

        const portfolio = await Portfolio.create(portfolioData)

        res.status(201).send({
            success: true,
            portfolio
        })
    }catch(err) {
        res.status(404).json({
            status: 'fail',
            messages: err.message
        })
    }
}

exports.getPortfolio = async (req,res,next) => {
    const {page} = req.query;
    try{
        const LIMIT = 6;
        const currentPage = Number(page) || 1; // Default to page 1 if not provided

        if (isNaN(currentPage) || currentPage < 1) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid page number. Page must be a positive integer.'
            });
        }

        const from = (currentPage - 1) * LIMIT;

        // For Supabase, we'll need to implement pagination differently
        // For now, let's get all and slice
        const allPortfolios = await Portfolio.findAll();
        const portfolios = allPortfolios.slice(from, from + LIMIT);

        // Prevent caching to ensure 200 responses
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        })

        res.status(200).send({
            status:'success',
            portfolios,
            pagination: {
                currentPage,
                totalItems: allPortfolios.length,
                totalPages: Math.ceil(allPortfolios.length / LIMIT),
                itemsPerPage: LIMIT
            }
        })

    }catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getAllPortfolio = async (req,res,next) => {
    try{
        const portfolios = await Portfolio.findAll()

        // Prevent caching to ensure 200 responses
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        })

        res.status(200).send({
            status:'success',
            portfolios,
        })

    }catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getPortfolioById = async (req,res,next) => {
    try{
        const portfolio = await Portfolio.findById(req.params.id)

        if (!portfolio) {
            return res.status(404).json({
                status: 'fail',
                message: 'Portfolio not found'
            })
        }

        // Prevent caching to ensure 200 responses
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        })

        res.status(200).send({
            status:'success',
            portfolio,
        })

    }catch (error) {
        console.log(error);
        next(error);
    }
}

exports.updatePortfolios = async (req,res,next) => {
    try{
        const currentPortfolio = await Portfolio.findById(req.params.id)
        const data = {
            company_name: req.body.company_name,
            project_name: req.body.project_name,
            project_category: req.body.project_category,
            project_description1: req.body.project_description1,
            project_date: req.body.project_date,
            project_videos: req.body.project_videos || currentPortfolio.project_videos,
            project_image: currentPortfolio.project_image
        }

        const updatePortfolio = await Portfolio.update(req.params.id, data)

        res.status(200).json({
            success: true,
            updatePortfolio
        })

    }catch(err){
        console.log(err.message);
        next(err);
    }
}

exports.deletePortfolio = async (req,res,next) => {
    try{
        const portfolios = await Portfolio.findById(req.params.id);
        for (let i =0; i < portfolios.project_image.length;  i++){
            const imgId = portfolios.project_image[i].public_id;
            if (imgId) {
                await cloudinary.uploader.destroy(imgId);
            }
        }
        await Portfolio.delete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Portfolio Deleted",

        })

    }
    catch (error) {
        console.log(error);
        next(error);

    }
}

exports.deletePortfolioImage = async (req,res,next) => {
    try{
        const portfolios = await Portfolio.findById(req.params.id)

        if(portfolios.project_image.length > 1) {
            // Find and remove the specific image
            const imageToDelete = portfolios.project_image.find(img => img.public_id === req.params.id1);
            if(imageToDelete && imageToDelete.public_id){
                await cloudinary.uploader.destroy(imageToDelete.public_id)
            }

            // Remove the image from the array
            const updatedImages = portfolios.project_image.filter(img => img.public_id !== req.params.id1);

            await Portfolio.update(req.params.id, { project_image: updatedImages })

            res.status(201).json({
                success: true,
                message: "Portfolio Image Deleted",
            })
        }else{
            res.status(404).json({
                success: false,
                message: 'Can`t delete the last image.'
            })
        }

    }catch(error){
        console.log(error.message);
        next(error);
    }
}

exports.addPortfolioImages = async (req,res,next) => {
    try{
        let images = [...req.body.project_image];
        let imagesBuffer = [];

        const portfolio = await Portfolio.findById(req.params.id);
        if (portfolio.project_image.length >= 5) {
            return res.status(400).send({
                success: false,
                messages: "Cannot add more images. Portfolio already has the maximum allowed images."
            });
        }

        for (let i =0; i < images.length;  i++){
            const result = await cloudinary.uploader.upload(images[i], {
                upload_preset: "NextPortfolio",
                width: 1600
            });

            imagesBuffer.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        }

        // Add new images to existing images
        const updatedImages = [...portfolio.project_image, ...imagesBuffer];

        const updatedPortfolio = await Portfolio.update(req.params.id, { project_image: updatedImages })

        res.status(201).send({
            success: true,
            updatedPortfolio
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}
