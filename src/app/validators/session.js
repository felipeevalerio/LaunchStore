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
async function post(req,res,next){

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("user/register",fillAllFields)
    }

    let {email,cpf_cnpj,password,passwordRepeat} = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g,"")

    const user = await User.findOne({
        where:{email},
        or:{cpf_cnpj}
    })
    
    if(user) return res.render("user/register",{
        user:req.body,
        error:"Usuário já cadastrado."
    })
    
    if(password !== passwordRepeat) return res.render("user/register",{
        user:req.body,
        error:"As senhas não coincidem"
    })

    next()
}

module.exports = {
    login
}