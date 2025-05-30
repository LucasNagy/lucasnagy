addEventListener("resize", () => updateText());
let text = document.querySelector(".text");

    function updateText() {
    let parent = text.parentElement;

    let inner_height = parent.clientHeight;
    let inner_width = parent.clientWidth;
    
    text.style.fontSize = inner_height + "px";

    let current_font_size = inner_height;
    while (text.clientWidth > inner_width || text.clientHeight > inner_height) {
        current_font_size -= 1;
        text.style.fontSize = current_font_size + "px";
    }
}

updateText();

let allImages = [];

const response = await fetch("/files/images/gallery/gallery_db.json");
allImages = await response.json();

async function fetchImages() {

    const photo = location.hash.substring(1);

    let index = allImages.indexOf(photo);
    if (index === -1) {
        index = 0;
    }
    
    let prev = document.querySelector("#prev");
    if (allImages[index-1] != null) {
        prev.href = "#"+allImages[index-1];
        prev.style.visibility = "visible"
    } else {
        prev.style.visibility = "hidden"
    }

    let next = document.querySelector("#next");
    if (allImages[index+1] != null) {
        next.href = "#"+allImages[index+1];
        next.style.visibility = "visible"
    } else {
        next.style.visibility = "hidden"
    }

    
    let currentPhoto = allImages[index];

    await updateViewport(currentPhoto);

}
window.addEventListener('hashchange', async() => {
    await fetchImages();
});

let imageFiles;
let imgFiletype;

async function updateViewport(currentPhoto, photoIndex) {

    let imageContainer = document.querySelector(".img-container");
    imageContainer.innerHTML= "";

    let version = photoIndex

    const imageOrder = ["cg", "bw", "edited", "raw"];
    if (photoIndex == null) {

        let response = await fetch(`/files/images/gallery/${currentPhoto}/images/files.json`)
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
    }


    let image = document.createElement("img");
    image.src = `/files/images/gallery/${currentPhoto}/images/${imageFiles[version]}`;

    imageContainer.appendChild(image);

    let response = await fetch(`/files/images/gallery/${currentPhoto}/metadata.json`);
    const metadata = await response.json();

    // Title
    document.querySelector(".text").textContent = metadata.title;
    // Date
    document.querySelector(".date").textContent = metadata.date;
    // Description
    document.querySelector(".desc-content").textContent = metadata.description;

    //Properties
    image.onload = function () {
        document.querySelector(".properties").innerHTML = "";
        createProperty("Dimensions:", `${image.naturalWidth}×${image.naturalHeight}`)

        createProperty("Camera:", metadata.exif.model);
        
        if (metadata.exif.aperture != null) {
            createProperty("Focal Length:", metadata.exif.focal_length+"mm");
            createProperty("Aperture:", "ƒ/"+metadata.exif.aperture);
            createProperty("Shutter Speed:", metadata.exif.exposure_time);
            createProperty("ISO:", metadata.exif.iso);
        }

        document.querySelector(".properties").appendChild(document.createElement("br"));

        createProperty("Photographer:", metadata.photographer);
        createProperty("Date:", metadata.date);
        let status = createProperty("Status:", imgFiletype[version]);
        status.children[1].style.textTransform = "capitalize";
    };
    image.onload();

    // Buttons

    // Switch Type
    let filters = document.querySelector(".filters");
    filters.innerHTML = "";

    imageOrder.reverse().forEach(filter => {

        if (!imgFiletype.includes(filter)) return;

        let filterButton = document.createElement("div");
        filterButton.classList.add("filter-button");

        if (filter == "raw") {
            filterButton.innerHTML = filter
        } else {
            let svg = document.createElement("object");
            svg.type = "image/svg+xml"
            svg.data = `/files/images/gallery/svgs/${filter}.svg`
            svg.style.pointerEvents = "none";

            filterButton.appendChild(svg);
            
        }
        
        if (filter == imgFiletype[version]) {
            let selected = document.querySelector(".selected");

            if (selected != null) {
                selected.classList.remove("selected");
            }

            filterButton.classList.add("selected");
        }

        filters.appendChild(filterButton);

        filterButton.addEventListener("click", async(e) => {

            await updateViewport(currentPhoto, imgFiletype.indexOf(filter));
        });
    });

}   

function createProperty(k, v) {
    if (v == null) return;
    let key = document.createElement("p");
    let value = document.createElement("p");

    key.classList.add("highlight");
    key.textContent = k;
    value.textContent = v;

    let section = document.createElement("section");
    section.appendChild(key);
    section.appendChild(value);

    document.querySelector(".properties").appendChild(section);

    return section;
}

await fetchImages();