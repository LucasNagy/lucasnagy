let allImages = [];



const response = await fetch("/files/images/gallery/gallery_db.json");
allImages = await response.json();


let imageFiles;
let imgFiletype;

async function fetchImages() {

    let version;

    const imageOrder = ["cg", "bw", "edited", "raw"];

    let lookup = {};

    let container = document.querySelector(".container");

    for (let imgName of allImages.reverse()) {
        let linkView = document.createElement("a");
        linkView.href = `./view#${imgName}`
        linkView.style.backgroundImage = "url(/files/images/loading.gif)"
        linkView.style.backgroundSize = "100%"

        container.appendChild(linkView);

        lookup[imgName] = linkView;
    }


    for (let imgName of allImages.reverse()) {

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
        image.style.opacity = "0";
        image.onload = () => {
            image.style.opacity = "100%";
        };



        lookup[imgName].appendChild(image);




    };

}

await fetchImages();