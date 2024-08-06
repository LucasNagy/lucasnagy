let jsonData = await (await fetch("output.json", { mode: "no-cors" })).json();

var sort = "newadd"
var filter = ""



let dropdown = document.querySelector(".sort")

let filterdropdown = document.querySelector(".filter")



dropdown.addEventListener("change",(e)=>{
	sort = e.target.value
	sortall()
})

filterdropdown.addEventListener("change",(e)=>{
	filter = e.target.value
	sortall()
})





function sort_albums(jsonData){

	let data

	switch (sort){
		case "titleaz":
			data = jsonData.toSorted((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0); 
			break
		case "titleza":
			data = jsonData.toSorted((a, b) => a.title !== b.title ? a.title < b.title ? 1 : -1 : 0); 
			break
		case "year09":
			data = jsonData.toSorted((a, b) => a.year !== b.year ? a.year < b.year ? -1 : 1 : 0); 
			break
		case "year90":
			data = jsonData.toSorted((a, b) => a.year !== b.year ? a.year < b.year ? 1 : -1 : 0);
			break
		case "artistaz":
			data = jsonData.toSorted((a, b) => a.artists !== b.artists ? a.artists < b.artists ? -1 : 1 : 0); 
			break
		case "artistza":
			data = jsonData.toSorted((a, b) => a.artists !== b.artists ? a.artists < b.artists ? 1 : -1 : 0); 
			break
		case "newadd":
			data = jsonData.toSorted((a, b) => a.date_added !== b.date_added ? a.date_added < b.date_added ? 1 : -1 : 0); 
			break
		case "oldadd":
			data = jsonData.toSorted((a, b) => a.date_added !== b.date_added ? a.date_added < b.date_added ? -1 : 1 : 0); 
			break
		default:
			data = jsonData
	}


	return data
} 

function filter_albums(jsonData){

	if(filter==="") return jsonData

	let data = []

	for(let song of jsonData){
		let genres = song.genres.split(",")
		genres = genres.map(r => {
			return r.trim()
		});
		let styles = song.styles.split(",")
		styles = styles.map(r => {
			return r.trim()
		});
		if(styles.includes(filter) || genres.includes(filter)) data.push(song)
	}

	return data
}





function sortall(){
	let data = sort_albums(jsonData)
	data = filter_albums(data)
	generate_albums(data)
}







function generate_albums(data){

	let cds = document.querySelector(".cds");

	cds.innerHTML = ""

	for(let release of data) {
		console.log(release);
		let { image, title, artists, year, genres, styles, formats, date_added } = release;

		let entire = document.createElement("div");
		entire.className = "item";

		let image_elem = document.createElement("img");
		image_elem.src = image;
		image_elem.className = "image";
		entire.appendChild(image_elem);

		let title_elem = document.createElement("p");
		title_elem.innerHTML = title;
		title_elem.className = "title";
		entire.appendChild(title_elem);

		let year_elem = document.createElement("p");
		year_elem.innerHTML = year;
		year_elem.className = "year";
		entire.appendChild(year_elem);

		let artist_elem = document.createElement("p");
		artist_elem.innerHTML = artists;
		artist_elem.className = "artist";
		entire.appendChild(artist_elem);

		let genre_elem = document.createElement("p");
		genre_elem.innerHTML = genres;
		genre_elem.className = "genre";
		entire.appendChild(genre_elem);

		let style_elem = document.createElement("p");
		style_elem.innerHTML = styles;
		style_elem.className = "style";
		entire.appendChild(style_elem);

		let format_elem = document.createElement("p");
		format_elem.innerHTML = formats;
		format_elem.className = "format";
		entire.appendChild(format_elem);
		
		let date = new Date(date_added);
		let date_elem = document.createElement("p");
		date_elem.innerHTML = date.toDateString();
		date_elem.className = "date";
		entire.appendChild(date_elem);

		cds.appendChild(entire);
	}
}


sortall()