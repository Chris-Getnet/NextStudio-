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
            if (!currentAbout.intro_image || req.body.intro_image.public_id !== currentAbout.intro_image.public_id){

                const ImgId = currentAbout.intro_image?.public_id;

                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }

                const newImage = await cloudinary.uploader.upload(req.body.intro_image, {
                    upload_preset: "NextAbout",

                });
                data.intro_image = {
                    public_id: newImage.public_id,
                    url: newImage.secure_url
                }
             }
             else{
                data.intro_image = {
                    public_id: currentAbout.intro_image.public_id,
                    url: currentAbout.intro_image.url
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