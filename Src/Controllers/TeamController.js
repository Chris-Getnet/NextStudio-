const { Team } = require('../Models')
const cloudinary = require('../Utils/cloudinary')

exports.createTeam = async (req,res,next) => {

    const {full_name,work_title,team_image} = req.body

    try{
        
        const result = await cloudinary.uploader.upload(team_image, {
            upload_preset: "NextTeam",
            // width: 300,
            // crop: "scale"
        })
        const team = await Team.create({
            full_name,
            work_title,
            team_image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })

        res.status(201).json({
            success: true,
            team
        })

    }catch(err){
        res.status(404).json({
            success: false,
            messages: err.message
        })
    }
}


exports.getTeam = async (req,res,next) => {
    try{
        const team = await Team.findAll()
        res.status(201).send({
            status:'success',
            team
            
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err
        })
    }
}

exports.updateTeam = async(req,res,next) => {
    try {
        const currentTeam = await Team.findById(req.params.id);
        
        if (!currentTeam) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }
        
        const data = {
            full_name: req.body.full_name,
            work_title: req.body.work_title,
        }

        if (req.body.team_image && req.body.team_image !== '') {
            // Check if team_image is already an object (already uploaded) or a string (needs upload)
            const isImageObject = typeof req.body.team_image === 'object' && 
                                  req.body.team_image !== null &&
                                  req.body.team_image.public_id && 
                                  req.body.team_image.url;
            
            // Get current image public_id from database (stored as separate columns)
            const currentImagePublicId = currentTeam.team_image_public_id || currentTeam.team_image?.public_id;
            const currentImageUrl = currentTeam.team_image_url || currentTeam.team_image?.url;
            
            if (isImageObject) {
                // Image is already uploaded (object with public_id and url)
                const incomingImagePublicId = req.body.team_image.public_id;
                
                if (!currentImagePublicId || incomingImagePublicId !== currentImagePublicId) {
                    // Different image - delete old one if it exists, then use the new one
                    if (currentImagePublicId) {
                        await cloudinary.uploader.destroy(currentImagePublicId);
                    }
                    data.team_image = {
                        public_id: req.body.team_image.public_id,
                        url: req.body.team_image.url
                    }
                } else {
                    // Same image, keep current one
                    data.team_image = {
                        public_id: currentImagePublicId,
                        url: currentImageUrl
                    }
                }
            } else {
                // Image is a string - check if it's a Cloudinary URL
                const isCloudinaryUrl = typeof req.body.team_image === 'string' && 
                                       req.body.team_image.includes('res.cloudinary.com');
                
                if (isCloudinaryUrl) {
                    // Extract public_id from Cloudinary URL
                    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
                    const urlParts = req.body.team_image.split('/upload/');
                    if (urlParts.length > 1) {
                        const pathAfterUpload = urlParts[1];
                        // Remove version if present (v1234567890/) and file extension
                        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
                        const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
                        
                        // Delete old image if it exists and is different
                        if (currentImagePublicId && currentImagePublicId !== publicId) {
                            await cloudinary.uploader.destroy(currentImagePublicId);
                        }
                        
                        data.team_image = {
                            public_id: publicId,
                            url: req.body.team_image
                        }
                    } else {
                        // Couldn't parse URL, try to upload it
                        if (currentImagePublicId) {
                            await cloudinary.uploader.destroy(currentImagePublicId);
                        }
                        const newImage = await cloudinary.uploader.upload(req.body.team_image, {
                            upload_preset: "NextTeam",
                        });
                        data.team_image = {
                            public_id: newImage.public_id,
                            url: newImage.secure_url
                        }
                    }
                } else {
                    // Image is a string (base64, file path, or external URL), upload it
                    // Delete old image if it exists
                    if (currentImagePublicId) {
                        await cloudinary.uploader.destroy(currentImagePublicId);
                    }
                    
                    const newImage = await cloudinary.uploader.upload(req.body.team_image, {
                        upload_preset: "NextTeam",
                    });
                    data.team_image = {
                        public_id: newImage.public_id,
                        url: newImage.secure_url
                    }
                }
            }
           
        }
        const UpdateTeam = await Team.update(req.params.id, data)

        res.status(200).json({
            success: true,
            UpdateTeam
        })


    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deleteTeam = async (req, res, next) => {

    try {
        const team = await Team.findById(req.params.id);
        
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }
        
        // Retrieve current image ID from database columns (stored as separate fields)
        const imgId = team.team_image_public_id || team.team_image?.public_id;
        
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        await Team.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Team Deleted",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

