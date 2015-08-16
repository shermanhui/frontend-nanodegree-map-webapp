var map;

function initMap() {
	var vancouver = {lat: 49.2827, lng: -123.1207};
	map = new google.maps.Map(document.getElementById('map'), {
		center: vancouver,
		zoom: 14
	});
}
