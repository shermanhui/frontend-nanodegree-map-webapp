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
];

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
				var contentString = getContentString(locations[i]);
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
			};
		})(marker, i));
	}
}

var getContentString = function(location) {
    var contentString =
    	'<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">'+ location.name +'</h1>'+
		'<div id="bodyContent">'+
		'<p><b>Interesting location description</b></p>'+
		'<p>'+ location.desc + '<p>' +
		'</div>'+
		'</div>';
    return contentString;
};


function viewModel() {
	var self = this;
	this.locationsList = ko.observableArray(locations.slice(0));
	this.query = ko.observable('');

	this.search = function(value) {
		self.locationsList.removeAll();
		for(var i in locations) {
			if (locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.locationsList.push(locations[i]);
			} else if (self.locationsList.length == 0) {
				null; // location for no match case
			}
		}
	};
	this.query.subscribe(this.search);
}

ko.applyBindings(new viewModel());