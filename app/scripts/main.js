var map;

// function initMap() {
// 	var vancouver = {lat: 49.2827, lng: -123.1207};
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: vancouver,
// 		zoom: 14,
// 		disableDefaultUI: true
// 	});
// }

var viewModel = function() {
	var self = this;

	var options, mapContainer;

	var myLocation = new google.maps.LatLng(49.2827, -123.1207);
		// vancouver = {lat: 49.2827, lng: -123.1207};
	mapContainer = document.getElementById('map');
	options = {
		center: myLocation,
		zoom: 14,
		disableDefaultUI: true
	};
	map = new google.maps.Map(mapContainer, options);

	return map;
};

ko.applyBindings(new viewModel());