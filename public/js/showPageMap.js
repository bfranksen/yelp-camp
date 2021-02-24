mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'show-map',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: campground.geometry.coordinates,
	zoom: 8,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({
			offset: 35,
			closeButton: false,
			closeOnClick: true,
		}).setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
	)
	.addTo(map);
