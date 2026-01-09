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
        const data = {
            full_name: req.body.full_name,
            work_title: req.body.work_title,
        }

        if (req.body.team_image !== '') {
             
             if (req.body.team_image.public_id !== currentTeam.team_image.public_id){
                
                const ImgId = currentTeam.team_image.public_id;
            
                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }
                
                const newImage = await cloudinary.uploader.upload(req.body.team_image, {
                    upload_preset: "NextTeam",
               
                });
                data.team_image = {
                    public_id: newImage.public_id,
                    url: newImage.secure_url
                }
             }
             else{
                data.team_image = {
                    public_id: currentTeam.team_image.public_id,
                    url: currentTeam.team_image.url
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
        //retrieve current image ID
        const imgId = team.team_image.public_id;
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        await Team.delete(req.params.id);

        res.status(201).json({
            success: true,
            message: " Team Deleted",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

