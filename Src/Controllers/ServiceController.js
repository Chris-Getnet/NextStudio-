const { Service } = require('../Models')
const  cloudinary  = require('../Utils/cloudinary');

exports.CreateServices = async (req,res,next) => {
    const {service_title,service_description,service_icon} = req.body
    try{
        const ServiceIcon = await cloudinary.uploader.upload(service_icon,{
            upload_preset: "NextService",
        })
        const Services = await Service.create({
            service_icon:{
                public_id: ServiceIcon.public_id,
                url: ServiceIcon.secure_url
            },
            service_title,
            service_description
        })
        res.status(201).json({
            success: true,
            data:{
                Services
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getAllServices = async (req,res,next) => {
    try{
        const service = await Service.findAll()

        res.status(200).send({
            success:true,
            service
        })
    }catch(err){
        res.status(404).json({
            success:false,
            messages: err.message
        })
    }
}

exports.updateService = async(req,res,next) => {
    try {
        const currentService = await Service.findById(req.params.id);
        const data = {
            service_title: req.body.service_title,
            service_description: req.body.service_description,
        }

        if (req.body.service_icon && req.body.service_icon !== '') {
            if (!currentService.service_icon || req.body.service_icon.public_id !== currentService.service_icon.public_id){

                const ImgId = currentService.service_icon?.public_id;

                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }

                const serviceIcon = await cloudinary.uploader.upload(req.body.service_icon, {
                    upload_preset: "NextService",

                });
                data.service_icon = {
                    public_id: serviceIcon.public_id,
                    url: serviceIcon.secure_url
                }
             }
             else{
                data.service_icon = {
                    public_id: currentService.service_icon.public_id,
                    url: currentService.service_icon.url
                }
             }

        }
        const updateService = await Service.update(req.params.id, data)

        res.status(200).json({
            success: true,
            updateService
        })


    } catch (error) {
        console.log(error);
        next(error);
    }
}
