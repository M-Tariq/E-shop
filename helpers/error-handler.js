function errorHandler (req, res, error){
    if(error){
        return res.status.json({error})
    }
};

module.exports = errorHandler;