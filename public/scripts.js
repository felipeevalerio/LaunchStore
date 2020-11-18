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