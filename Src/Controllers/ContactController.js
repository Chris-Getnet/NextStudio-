const { Contact } = require('../Models')

exports.CreateContact = async (req,res,next) => {
    try{
        const newContact = await Contact.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                newContact
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getContact = async (req,res,next) => {
    try{
        const contact = await Contact.findById("4da73595-80af-484d-983b-62bfab432022")
        res.status(201).send({
            status:'success',
            contact
            
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err
        })
    }
}

exports.updateContact = async (req,res,next) => {
    try{
        const contact = await Contact.update("4da73595-80af-484d-983b-62bfab432022", req.body)
        res.status(200).json({
            status: 'success',
            data:{
                contact
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err
        })
    }
}