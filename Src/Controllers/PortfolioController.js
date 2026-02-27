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
        const portfolioId = req.params.id;
        // Get public_id from query parameter (supports slashes in public_id)
        // Express automatically decodes URL-encoded query parameters
        const imagePublicId = req.query.publicId || req.body.publicId;

        if (!imagePublicId) {
            return res.status(400).json({
                success: false,
                message: 'Image public_id is required. Provide it as a query parameter: ?publicId=...'
            })
        }

        const portfolio = await Portfolio.findById(portfolioId)

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found'
            })
        }

        if(!portfolio.project_image || portfolio.project_image.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No images found in portfolio'
            })
        }

        // Find the image first to verify it exists
        const imageToDelete = portfolio.project_image.find(img => img.public_id === imagePublicId);
        
        if (!imageToDelete) {
            // Debug info: show available public_ids
            const availableIds = portfolio.project_image.map(img => img.public_id);
            return res.status(404).json({
                success: false,
                message: `Image with public_id "${imagePublicId}" not found in portfolio`,
                debug: {
                    requestedId: imagePublicId,
                    availableIds: availableIds,
                    totalImages: portfolio.project_image.length
                }
            })
        }

        // Check if this is the last image
        if(portfolio.project_image.length <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last image. Portfolio must have at least one image.'
            })
        }

        // Delete from Cloudinary
        if(imageToDelete.public_id){
            await cloudinary.uploader.destroy(imageToDelete.public_id)
        }

        // Remove the image from the array
        const updatedImages = portfolio.project_image.filter(img => img.public_id !== imagePublicId);

        // Verify we actually removed an image
        if(updatedImages.length === portfolio.project_image.length) {
            return res.status(400).json({
                success: false,
                message: 'Failed to remove image from array'
            })
        }

        // Update the portfolio with the new images array
        const updatedPortfolio = await Portfolio.update(portfolioId, { project_image: updatedImages })

        res.status(200).json({
            success: true,
            message: "Portfolio Image Deleted",
            portfolio: updatedPortfolio
        })

    }catch(error){
        console.log('Error deleting portfolio image:', error);
        next(error);
    }
}

exports.addPortfolioImages = async (req,res,next) => {
    try{
        const portfolio = await Portfolio.findById(req.params.id);
        
        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found"
            });
        }

        const currentImageCount = portfolio.project_image ? portfolio.project_image.length : 0;
        const imagesToAdd = req.body.project_image || [];
        
        if (currentImageCount + imagesToAdd.length > 5) {
            return res.status(400).json({
                success: false,
                message: `Cannot add more images. Portfolio already has ${currentImageCount} image(s). Maximum allowed is 5.`
            });
        }

        if (imagesToAdd.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images provided to add"
            });
        }

        const existingImages = portfolio.project_image || [];
        const existingPublicIds = new Set(existingImages.map(img => img.public_id));
        let imagesBuffer = [];

        console.log(`Adding ${imagesToAdd.length} image(s) to portfolio. Current images: ${existingImages.length}`);

        for (let i = 0; i < imagesToAdd.length; i++){
            const imageItem = imagesToAdd[i];
            console.log(`Processing image ${i + 1}/${imagesToAdd.length}, type: ${typeof imageItem}`);
            
            // Check if it's already an object with public_id and url (already uploaded)
            const isImageObject = typeof imageItem === 'object' && 
                                  imageItem !== null &&
                                  imageItem.public_id && 
                                  imageItem.url;
            
            if (isImageObject) {
                // Check if this image already exists in the portfolio
                if (existingPublicIds.has(imageItem.public_id)) {
                    console.log(`Skipping duplicate image with public_id: ${imageItem.public_id}`);
                    continue; // Skip duplicates
                }
                // Image is already uploaded, use it directly
                console.log(`Adding existing image with public_id: ${imageItem.public_id}`);
                imagesBuffer.push({
                    public_id: imageItem.public_id,
                    url: imageItem.url
                });
            } else if (typeof imageItem === 'string') {
                // Check if it's a Cloudinary URL
                const isCloudinaryUrl = imageItem.includes('res.cloudinary.com');
                
                if (isCloudinaryUrl) {
                    // Extract public_id from Cloudinary URL
                    const urlParts = imageItem.split('/upload/');
                    if (urlParts.length > 1) {
                        const pathAfterUpload = urlParts[1];
                        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
                        const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
                        
                        // Check if this image already exists
                        if (existingPublicIds.has(publicId)) {
                            console.log(`Skipping duplicate image with public_id: ${publicId}`);
                            continue; // Skip duplicates
                        }
                        
                        imagesBuffer.push({
                            public_id: publicId,
                            url: imageItem
                        });
                    } else {
                        // Couldn't parse, try to upload
                        const result = await cloudinary.uploader.upload(imageItem, {
                            upload_preset: "NextPortfolio",
                            width: 1600
                        });
                        imagesBuffer.push({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                    }
                } else {
                    // Upload new image (base64 or file path)
                    console.log(`Uploading new image at index ${i} (base64 string, length: ${imageItem.length})`);
                    try {
                        const result = await cloudinary.uploader.upload(imageItem, {
                            upload_preset: "NextPortfolio",
                            width: 1600
                        });
                        console.log(`Successfully uploaded image with public_id: ${result.public_id}, url: ${result.secure_url}`);
                        imagesBuffer.push({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                    } catch (uploadError) {
                        console.error(`Error uploading image at index ${i}:`, uploadError);
                        return res.status(500).json({
                            success: false,
                            message: `Failed to upload image at index ${i}: ${uploadError.message}`
                        });
                    }
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Invalid image format at index ${i}. Expected object with public_id and url, Cloudinary URL string, or base64 string.`
                });
            }
        }

        // Add new images to existing images
        console.log(`Adding ${imagesBuffer.length} new image(s) to ${existingImages.length} existing image(s)`);
        const updatedImages = [...existingImages, ...imagesBuffer];
        console.log(`Total images after update: ${updatedImages.length}`);

        const updatedPortfolio = await Portfolio.update(req.params.id, { project_image: updatedImages })

        res.status(200).json({
            success: true,
            portfolio: updatedPortfolio
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to add portfolio images"
        })
    }
}
