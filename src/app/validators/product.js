async function post(req,res,next){

    const keys = Object.keys(req.body)

    for(let key of keys){
        if(req.body[key] == "" && key != "removed_files") return res.send("Please,fill all the fields!")
    }
    
    next()
}

module.exports = {
    post
}