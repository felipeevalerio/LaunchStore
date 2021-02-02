const { hash } = require("bcryptjs")
const {unlinkSync} = require("fs")

const User = require("../models/User")

const {formatCep,formatCpfCnpj} = require("../../lib/utils")
const Product = require("../models/Product")
const LoadService = require("../services/LoadProductService")

module.exports = {
    registerForm(req,res){
        return res.render("user/register")
    },
    async post(req,res){
        try {
            let {name,email,password,cpf_cnpj,cep,address} = req.body

            password = await hash(password,8)
            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId

            return res.redirect("/users")   
    
        } catch (err) {
            console.error(err)
        }
        
    },
    async show(req,res){
        try {
            const {user} = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render("user/index",{user})

        } catch (err) {
            console.error(err)
        }
        
    },
    async update(req,res){
        try{
            const {user} = req
            let {name,email,cpf_cnpj,cep,address} = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            await User.update(user.id,{
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render("user/index",{
                sucess:"Conta atualizada com sucesso",
                user:req.body
            })
        }
        catch(err){
            console.error(err)
            return res.render("user/index",{
                error:"Algum erro aconteceu!"
            })
        }
    },
    async delete(req,res){
        try {
            //Pegar todos os produtos
            const products = await Product.findAll({where:{user_id:req.body.id}})
            //Pegas todas as imagens    
    
            const allFilesPromise = products.map(product =>
                Product.files(product.id))

            let promiseResults = await Promise.all(allFilesPromise)
            
            //rodar a remoção do usuário
            await User.delete(req.body.id)
            req.session.destroy()
            //Remover as imagens da pasta public
            promiseResults.map(files =>{
                files.map(file => {
                    try{
                        unlinkSync(file.path)
                    }catch(err){
                        console.error(err)
                    }
                })
            })
            return res.render("user/index",{
                sucess:"Conta deletada com sucesso!"
            })

        } catch (err) {
            console.error(err);
            return res.render("user/index",{
                user:req.body,
                error:"Erro ao deletar sua conta!"
            })
        }
    },
    async ads(req,res){
        try {
            const products = await LoadService.load("products",{
                where:{user_id:req.session.userId}}
            )

            return res.render("user/ads",{products})


        } catch (err) {
            console.error(err)
        }
    }

}