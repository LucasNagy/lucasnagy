let file = await fetch("output.json", { mode: "no-cors" })
	.then((response) => response.json())
	.then((data) => data)
	.catch((error) => {
		console.error("There was an error!", error);
		return;
	});

let cds = document.querySelector(".cds");

for(let release of file) {
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