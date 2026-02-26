const { About } = require('../Models')
const  cloudinary  = require('../Utils/cloudinary');


exports.CreateAbout = async (req,res,next) => {
    const {intro_image,about_desc} = req.body

    try{

        const IntroImage = await cloudinary.uploader.upload(intro_image,{
            upload_preset: "NextAbout"
        })

        const about = await About.create({
            intro_image:{
                public_id: IntroImage.public_id,
                url: IntroImage.secure_url
            },
            about_desc
        })

        res.status(201).json({
            success: true,
            about
        })
    }
    catch(err){
        res.status(404).json({
            status: false,
            message: err.message
        })
    }
}

exports.getAbout = async (req,res,next) => {
    try{
        const about = await About.findById("262ad622-589f-4cb5-886a-6df5982b183e")
        res.status(201).send({
            success: true,
            about
            
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err 
        })
    }
}

exports.updateAbout = async(req,res,next) => {
    try {
        const currentAbout = await About.findById("262ad622-589f-4cb5-886a-6df5982b183e");
        const data = {
            about_desc: req.body.about_desc
        }

        if (req.body.intro_image && req.body.intro_image !== '') {
            // Check if intro_image is already an object (already uploaded) or a string (needs upload)
            const isImageObject = typeof req.body.intro_image === 'object' && 
                                  req.body.intro_image !== null &&
                                  req.body.intro_image.public_id && 
                                  req.body.intro_image.url;
            
            // Get current image public_id from database (stored as separate columns)
            const currentImagePublicId = currentAbout.intro_image_public_id || currentAbout.intro_image?.public_id;
            const currentImageUrl = currentAbout.intro_image_url || currentAbout.intro_image?.url;
            
            if (isImageObject) {
                // Image is already uploaded (object with public_id and url)
                const incomingImagePublicId = req.body.intro_image.public_id;
                
                if (!currentImagePublicId || incomingImagePublicId !== currentImagePublicId) {
                    // Different image - delete old one if it exists, then use the new one
                    if (currentImagePublicId) {
                        await cloudinary.uploader.destroy(currentImagePublicId);
                    }
                    data.intro_image = {
                        public_id: req.body.intro_image.public_id,
                        url: req.body.intro_image.url
                    }
                } else {
                    // Same image, keep current one
                    data.intro_image = {
                        public_id: currentImagePublicId,
                        url: currentImageUrl
                    }
                }
            } else {
                // Image is a string (base64, file path, or URL), upload it
                // Delete old image if it exists
                if (currentImagePublicId) {
                    await cloudinary.uploader.destroy(currentImagePublicId);
                }
                
                const newImage = await cloudinary.uploader.upload(req.body.intro_image, {
                    upload_preset: "NextAbout",
                });
                data.intro_image = {
                    public_id: newImage.public_id,
                    url: newImage.secure_url
                }
            }

        }
        const updateAbout = await About.update("262ad622-589f-4cb5-886a-6df5982b183e", data)

        res.status(200).json({
            success: true,
            updateAbout
        })


    } catch (error) {
        console.log(error);
        next(error);
    }
}