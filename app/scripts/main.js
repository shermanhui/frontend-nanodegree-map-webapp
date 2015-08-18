var map;

// original code from Google Maps API
function initMap() {
	var vancouver = {lat: 49.2827, lng: -123.1207};
	map = new google.maps.Map(document.getElementById('map'), {
		center: vancouver,
		zoom: 14,
		disableDefaultUI: true
	});
	marker.addListener('click', toggleBounce);
	marker.addListener('click', function(){
		infoWindow.open(map, marker)
	});
	marker.setMap(map); // To add the marker to the map, call setMap();
}

var myLatlng = {lat: 49.2844, lng: -123.1089};

// marker code 
var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!",
    draggable: false,
    animation: google.maps.Animation.DROP
});

// info window template
var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Gastown Steam Clock</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Interesting location description</b></p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

// info window
var infoWindow = new google.maps.InfoWindow({
	content: contentString
})

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
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