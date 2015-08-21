var map, infoWindow, i;
var myLatlng = {lat: 49.2844, lng: -123.1089};
var locations = [
	{
		'name': "Steam Clock",
		'lat': 49.2844,
		'lng': -123.1089,
		'desc': "Steam Clock!"
	},
	{
		'name': "Aquarium",
		'lat': 49.301286,
		'lng': -123.130843,
		'desc': 'Fishies!'
	},
	{
		'name': "Science World",
		'lat': 49.273513,
		'lng': -123.103834,
		'desc': 'How do magnets work..'
	}
]
var markerArray = [];
// original code from Google Maps API
function initMap() {
	//var bounds = new google.maps.LatLngBounds();
	infoWindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatlng,
		zoom: 14,
		disableDefaultUI: false
	});

	for (i = 0; i < locations.length; i++){
		marker = new google.maps.Marker({
		position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
		map: map,
		animation: google.maps.Animation.DROP
	});

		google.maps.event.addListener(marker, 'click', (function(marker, i){
			return function(){
				var contentString =
					'<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">'+ locations[i].name +'</h1>'+
					'<div id="bodyContent">'+
					'<p><b>Interesting location description</b></p>'+
					'<p>'+ locations[i].desc + '<p>' +
					'</div>'+
					'</div>';
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
			}
		})(marker, i));
	};
}



function viewModel() {
	markers = ko.observableArray[locations],
	query = ko.observable('')

	search = function(value) {
		viewModel.markers.removeAll();
		for(var x in markers) {
			if(markers[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				viewModel.markers.push(markers[x]);
			}
		}
	};
	query.subscribe(viewModel.search);
};
console.log(markerArray);
ko.applyBindings(new viewModel());