var map;
var myLatlng = {lat: 49.2844, lng: -123.1089};
var markers = [
	{
		'name': "Steam Clock",
		'lat': 49.2844,
		'lng': -123.1089
	},
	{
		'name': "Aquarium",
		'lat': 49.301286,
		'lng': -123.130843
	},
	{
		'name': "Science World",
		'lat': 49.273513,
		'lng': -123.103834
	}
]

// original code from Google Maps API
function initMap() {
	var vancouver = {lat: 49.2827, lng: -123.1207};
	var bounds = new google.maps.LatLngBounds();
	var infoWindow = new google.maps.InfoWindow();
	//var bounce = toggleBounce();
	var marker, i;
	map = new google.maps.Map(document.getElementById('map'), {
		center: vancouver,
		zoom: 14,
		disableDefaultUI: true
	});
	// marker.addListener('click', toggleBounce);
	// marker.addListener('click', function(){
	// 	toggleBounce;
	// 	infoWindow.open(map, marker)
	// });
	// marker.setMap(map); // To add the marker to the map, call setMap();
	for (i = 0; i < markers.length; i++){
		marker = new google.maps.Marker({
		position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
		map: map
	});
		google.maps.event.addListener(marker, 'click', (function(marker, i){
			return function(){
				var contentString =
					'<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">'+ markers[i].name +'</h1>'+
					'<div id="bodyContent">'+
					'<p><b>Interesting location description</b></p>'+
					'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
					'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
					'(last visited June 22, 2009).</p>'+
					'</div>'+
					'</div>';
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
			}
		})(marker, i));
	};
	// function toggleBounce() {
	// 	if (marker.getAnimation() !== null) {
	// 		marker.setAnimation(null);
	// 	} else {
	// 		marker.setAnimation(google.maps.Animation.BOUNCE);
	// 	}
	// };
}
// // marker code
// var marker = new google.maps.Marker({
//     position: myLatlng,
//     title:"Hello World!",
//     draggable: false,
//     animation: google.maps.Animation.DROP
// });




initMap();





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