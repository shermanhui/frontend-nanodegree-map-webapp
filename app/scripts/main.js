var map;

// original code from Google Maps API
function initMap() {
	var vancouver = {lat: 49.2827, lng: -123.1207};
	map = new google.maps.Map(document.getElementById('map'), {
		center: vancouver,
		zoom: 14,
		disableDefaultUI: true
	});
}

var myLatlng = {lat: 49.2844, lng: -123.1089};
var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
});
initMap();
// To add the marker to the map, call setMap();
marker.setMap(map);


// var exampleData = [
// 	{
// 		'lat': 49.2844, 
// 		'lng': -123.1089,
// 		'name': "steam clock"
// 	}
// ];

// var viewModel = function() {
// 	var self = this;

// 	var options, mapContainer, myLocation;

// 	// vancouver = {lat: 49.2827, lng: -123.1207};
// 	initMap = function(){
// 		myLocation = new google.maps.LatLng(49.2827, -123.1207);
// 		mapContainer = document.getElementById('map');

// 		options = {
// 			center: myLocation,
// 			zoom: 14,
// 			disableDefaultUI: true
// 		};

// 		map = new google.maps.Map(mapContainer, options);
// 	};
// 	initMap();
// };

// ko.applyBindings(new viewModel());