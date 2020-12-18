const crypto = require("crypto")
const User = require("../models/User")
const mailer = require("../../lib/mailer")
module.exports = {
    loginForm(req,res){
        return res.render("session/login")
    },
    login(req,res){
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    logout(req,res){
        req.session.destroy()
        return res.redirect('/')
    },
    forgotForm(req,res){
        return res.render("session/forgot-password")
    },
    async forgot(req,res){
        const user = req.user

        const token = crypto.randomBytes(20).toString("hex")

        let now = new Date()
        now = now.setHours(now.getHours() + 1)

        await User.update(user.id,{
            reset_token:token,
            reset_token_expires:now
        })

        await mailer.sendMail({
            to:user.email,
            from:"no-reply@felipeevalerio@outlook.com",
            subject:"Recuperação de Senha",
            html:` <h2>Perdeu a chave?</h2>
            <p>Não se preocupe,clique no link abaixo para recuperar sua senha</p>
            <p><a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">Recuperar Senha</a></p>
            `
        })

        return res.render("session/forgot-password",{
            sucess:"Verifique seu Email para recuperar sua senha"
        })
    },
    resetForm(req,res){
        return res.render("session/password-reset",{token:req.query.token})
    },
    async reset(req,res){
        const {email,password,passwordRepeat,token} = req.body

        try{
            //Procurar o usuario
            
            //Senha bate

            //verificar se o token bate

            //verificar se o token não expirou

            //cria um novo hash de senha

            //atualiza o usuario

            //avisa o usuario que ele tem uma nova senha 
        }   
        catch(err){
            console.error(err)
            return res.render("session/password-reset",{
                error:"Ocorreu um erro inesperado. Por favor, tente novamente!"
            })
        }
    }
}