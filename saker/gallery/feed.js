let allImages = [];



const response = await fetch("/files/images/gallery/gallery_db.json");
allImages = await response.json();


let imageFiles;
let imgFiletype;

async function fetchImages() {

    let version;

    const imageOrder = ["cg", "bw", "edited", "raw"];



    allImages.reverse().forEach(async imgName => {

        let response = await fetch(`/files/images/gallery/${imgName}/images/files.json`);
        imageFiles = await response.json();

        imgFiletype = imageFiles.map(elm => {
            return elm.split(".")[0]
        })

        let first;
        for (let img of imageOrder) {
            if (imgFiletype.includes(img)){
                first = imgFiletype.indexOf(img)
                break;
            }
            
        }
        version = first

        let image = document.createElement("img");
        image.src = `/files/images/gallery/${imgName}/images/${imageFiles[version]}`;

        let linkView = document.createElement("a");
        linkView.href = `./view#${imgName}`
        linkView.appendChild(image);

        document.querySelector(".container").appendChild(linkView);

    });

}

await fetchImages();