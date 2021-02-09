const loadProductService = require("../services/LoadProductService")
const User = require("../models/User")
const mailer = require("../../lib/mailer")

const email = (product,seller,buyer) => `
    <h2>Olá ${seller.name}!</h2>
    <p>Você tem um novo pedido de compra do seu produto</p>
    <p>Produto:${product.name}</p>
    <p>Preço:${product.formatedPrice}</p>
    <p><br/><br/></p>
    <h3>Dados do comprador:</h3>
    <p>Nome:${buyer.name}</p>
    <p>Email:${buyer.email}</p>
    <p>Endereço:${buyer.address}</p>
    <p>CEP:${buyer.cep}</p>
    <p><br/><br/></p>
    <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
    <p><br/><br/></p>
    <p>Atenciosamente,Equipe Launchstore</p>
`

module.exports = {
    async post(req,res){
        try{
            const product = await loadProductService.load("product",{where:{id:req.body.id}})

            const seller = await User.findOne({where:{id:product.user_id}})

            const buyer = await User.findOne({where:{id:req.session.userId}})

            await mailer.sendMail({
                to:seller,
                from:"no-reply@launchstore.com.br",
                subject:"Novo pedido de compra",
                html:email(product,seller,buyer)
            })

            return res.render("orders/sucess")
        }
        catch(err){
            console.error(err)
            return res.render("orders/error")
        }

    }
}