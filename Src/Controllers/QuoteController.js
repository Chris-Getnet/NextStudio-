const { Quote } = require('../Models')

exports.CreateQuote = async (req,res,next) => {
    try{
        const newQuote = await Quote.create(req.body)
        res.status(201).json({
            success: true,
            newQuote
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

exports.getQuote = async (req,res,next) => {
    console.log('getQuote endpoint called')
    try{
        const quote = await Quote.findById("f9903c3c-fe71-4a6b-a96c-0a6f2d6d4710")
        console.log('Quote found:', quote)
        res.status(200).send({
            success: true,
            quote
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

exports.updateQuote = async (req,res,next) => {
    try{
        const quote = await Quote.update("f9903c3c-fe71-4a6b-a96c-0a6f2d6d4710", req.body)
        res.status(200).json({
            success:true,
            quote
        })
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        })
    } 
}