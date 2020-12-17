exports.date = function(timestamp){

    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    const hour = date.getHours()
    const minutes = date.getMinutes()
    
    return {
        day,
        month,
        year,
        hour,
        minutes,
        iso:`${year}-${month}-${day}`,
        birthDay:`${day}/${month}`,
        format:`${day}/${month}/${year}`
    }
}
exports.formatBRL = function(price){
    return new Intl.NumberFormat('pt-BR',{
        style:"currency",
        currency:"BRL"
    }).format(price / 100)
}

exports.formatCpfCnpj = function(value){
    value = value.replace(/\D/g,"")

    if(value.length > 14)
        value = value.slice(0,-1)
    //check if cnpj
    
    //11222333444455
    if(value.length > 11){
        //11.222333444455
        value = value.replace(/(\d{2})(\d)/,"$1.$2")
        //11.222.333444455
        value = value.replace(/(\d{3})(\d)/,"$1.$2")
        //11.222.333
        value = value.replace(/(\d{3})(\d)/,"$1/$2")

        value = value.replace(/(\d{4})(\d)/,"$1-$2")
    }else{
        //137.476.056-05
        value = value.replace(/(\d{3})(\d)/,"$1.$2")

        value = value.replace(/(\d{3})(\d)/,"$1.$2")

        value = value.replace(/(\d{3})(\d)/,"$1-$2")
        return value
    }
    return value
}

exports.formatCep = function (value){
    value = value.replace(/\D/,"")

    if(value.length > 8)
        value = value.slice(0,-1)


    value = value.replace(/(\d{5})(\d)/,"$1-$2")
    return value
}   