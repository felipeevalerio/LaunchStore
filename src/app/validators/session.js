const User = require("../models/User")
const {compare} = require("bcryptjs")


async function login(req,res,next){
    const {email,password} = req.body

    const user = await User.findOne({where:{email}})

    if(!user) return res.render("session/login",{
        error:"Usuário não cadastrado!",
        user:req.body
    })

    const passed = await compare(password,user.password)
    
    if(!passed) return res.render("session/login",{
        user:req.body,
        error:"Senha incorreta"
    })

    req.user = user

    next()
}

async function forgot(req,res,next){
    const {email} = req.body
    let user = await User.findOne({where:{email}})
    
    if(!user)
        return res.render("session/forgot-password",{
            user:req.body,
            error:"Usuário não cadastrado"
        })


    req.user = user
    next()
}

async function reset(req,res,next){
    //Procurar o usuario
    const {email,password,passwordRepeat,token} = req.body

    const user = await User.findOne({where:{email}})

    if(!user) 
        return res.render("session/password-reset",{
            user:req.body,
            token,
            error:"Email não encontrado"
        })
    //Senha bate
    if(password !== passwordRepeat)
        return res.render("session/password-reset",{
            user:req.body,
            token,
            error:"As senhas não coincidem"
        })
    //verificar se o token bate
    if(token !== user.reset_token) 
        return res.render("session/password-reset",{
            user:req.body,
            token,
            error:"Token Inválido! Solicite uma nova requisição de senha."
        })

    let now = new Date()
    now = now.setHours(now.getHours())

    //verificar se o token não expirou
    if(now > user.reset_token_expires)
        return res.render("session/password-reset",{
            user:req.body,
            token,
            error:"Token Expirado! Solicite uma nova requisição de senha."
        })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}