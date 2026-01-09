const { Video } = require('../Models')
const cloudinary = require('../Utils/cloudinary')

exports.CreateVideo = async (req,res,next) => {
    try{

        const {banner_video} = req.body

        const video = await cloudinary.uploader.upload(banner_video, {
            resource_type: "video",
            folder: "NextAbout"
        })

        const BVideo = await Video.create({
            banner_video:{
                public_id: video.public_id,
                url: video.secure_url
            }
        })

        res.status(201).send({
            success: true,
            BVideo
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}

exports.getBannerVideo = async (req,res,next) => {
    console.log('getBannerVideo endpoint called')
    try{
        const videos = await Video.findAll()
        if (videos.length === 0) {
            return res.status(404).json({
                status:'fail',
                message: 'No banner video found'
            })
        }
        // Return the first (or most recent) banner video
        const video = videos[0]
        res.status(200).send({
            status:'success',
            video
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}

exports.UpdateBannerVideo = async (req,res,next) => {
    try {
        const videos = await Video.findAll()
        if (videos.length === 0) {
            return res.status(404).json({
                status:'fail',
                message: 'No banner video found to update'
            })
        }

        const currentBannerVideo = videos[0]; // Update the first video
        const data = {}

        if (req.body.banner_video !== '') {

            if (req.body.banner_video.public_id !== currentBannerVideo.banner_video_public_id){

                const ImgId = currentBannerVideo.banner_video_public_id;

                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }

                const newVideo = await cloudinary.uploader.upload(req.body.banner_video, {
                    resource_type: "video",
                    upload_preset: "NextAbout",
                  })

                data.banner_video_public_id = newVideo.public_id
                data.banner_video_url = newVideo.secure_url
             }
             else{
                data.banner_video_public_id = currentBannerVideo.banner_video_public_id
                data.banner_video_url = currentBannerVideo.banner_video_url
             }

        }
        const updateBannerV = await Video.update(currentBannerVideo.id, data)

        res.status(200).send({
            success: true,
            updateBannerV
        })


    } catch (err) {
        res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}

