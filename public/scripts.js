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

    }   
}

const photosUpload = {
    uploadLimit:6,
    handleFileInput(event){
        const {files: fileList} = event.target
        const {uploadLimit} = photosUpload

        if(fileList.length > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return 
        }

        Array.from(fileList).forEach((file)=>{
            const reader = new FileReader()

            reader.onload = ()=>{
                const image = new Image()
                image.src = String(reader.result)

                const container = document.createElement('div')
                container.classList.add('photo')

                container.onclick = ()=> alert('OK')

                container.appendChild(image)

                document.querySelector("#photos-preview").appendChild(container)

            }
            reader.readAsDataURL(file)
        })
    }


}