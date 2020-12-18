const Mask = {
    apply(input,func){
        setTimeout(()=>{
            input.value = Mask[func](input.value)
        },1)
    },
    formatBRL(value){
        value = value.replace(/\D/g,'')

        return new Intl.NumberFormat('pt-BR',{
            style:"currency",
            currency:"BRL"
        }).format(value / 100)

    },
    cpfCnpj(value){
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
    },
    cep(value){
        value = value.replace(/\D/,"")

        if(value.length > 8)
            value = value.slice(0,-1)


        value = value.replace(/(\d{5})(\d)/,"$1-$2")
        return value
    }   
}

const photosUpload = {
    input:"",
    preview:document.querySelector("#photos-preview"),
    uploadLimit:6,
    files:[],
    handleFileInput(event){
        const {files: fileList} = event.target
        photosUpload.input = event.target
       
        if(photosUpload.haslimit(event)) return

        Array.from(fileList).forEach((file)=>{
        
            photosUpload.files.push(file)
        
            const reader = new FileReader()

            reader.onload = ()=>{
                const image = new Image()
                image.src = String(reader.result)

                const container = photosUpload.getContainer(image) 

                photosUpload.preview.appendChild(container)

            }
            reader.readAsDataURL(file)
        })
        photosUpload.input.files = photosUpload.getAllFiles()
    },
    getContainer(image){
        const container = document.createElement('div')
        container.classList.add('photo')

        container.onclick = photosUpload.removePhoto

        container.appendChild(image)

        container.appendChild(photosUpload.getRemoveButton())
        
        return container
    },
    haslimit(event){
        const {uploadLimit,input,preview} = photosUpload
        const {files:fileList} = input

        if(fileList.length > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return 
        }

        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if(item.classList && item.classList.value =='photo'){
                photosDiv.push(item)
            }
        })

        const totalPhotos = photosDiv.length + fileList.length
        if(totalPhotos > uploadLimit){
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        photosUpload.files.forEach(file =>{
            dataTransfer.items.add(file)
        })

        return dataTransfer.files
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event){

        const photoDiv = event.target.parentNode // <div class="photo </div>"
        const photosArray = Array.from(photosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        photosUpload.files.splice(index,1)
        photosUpload.input.files = photosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode
 
        if(photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"]')
            
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }


}

const ImageGallery ={
    highlight:document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery_preview img'),
    setImage(e){
        const {target} = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add("active")

        ImageGallery.highlight.src = target.src
        LightBox.image.src = target.src
    }
}

const LightBox = {
    target:document.querySelector('.lightbox_target'),
    image:document.querySelector('.lightbox_target img'),
    closeButton: document.querySelector('.lightbox_close'),
    open(){
        LightBox.target.style.opacity = 1
        LightBox.target.style.top = 0
        LightBox.target.style.bottom = 0
        LightBox.closeButton.style.top = 0
    },
    close(){
        LightBox.target.style.opacity = 0
        LightBox.target.style.top = "-100%"
        LightBox.target.style.bottom = "initial"
        LightBox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input,func){

        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error) Validate.displayError(input,results.error)

    },
    displayError(input,error){
        const div = document.createElement("div")
        div.classList.add("error")
        div.innerHTML = error
        input.parentNode.appendChild(div)

    },
    clearErrors(input){
        const errorDiv = input.parentNode.querySelector('.error')
        if(errorDiv)
            errorDiv.remove()
        
    },
    isEmail(value){
        let error = null
        /*
            // => Começar uma Regular Expression
            ^ => Inicio da expressão
            \w=> Escrita sem caracteres especiais
            + => 1 ou mais
            ([]) => Conjunto
        */  
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat))
            error = "Email Inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value){
        let error = null

        const cleanValues = value.replace(/\D/g,"")

        if(cleanValues.length > 11 && cleanValues.length !== 14){
            error = "CNPJ Incorreto"
        }
        else if(cleanValues.length < 12 && cleanValues.length !== 11){
            error = "CPF Incorreto"
        }

        return {
            error,
            value
        }
    },
    isCep(value){
        let error = null

        const cleanValues = value.replace(/\D/g,"")
        if(cleanValues.length !== 8){
            error = "CEP Inválido"
        }

        return {
            error,
            value
        }
    }
}

