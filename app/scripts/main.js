var map, infoWindow, i;
var CLIENT_ID = 'Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ';
var CLIENT_SECRET = 'NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI';
var fourSquare_URL = 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20150825';

var myLatlng = {lat: 49.2844, lng: -123.1089};
var locations = [
	{
		'name': 'Steam Clock',
		'lat': 49.2844,
		'lng': -123.1089,
		'desc': "Steam Clock!"
	},
	{
		'name': 'Aquarium',
		'lat': 49.301286,
		'lng': -123.130843,
		'desc': 'Fishies!'
	},
	{
		'name': 'Science World',
		'lat': 49.273513,
		'lng': -123.103834,
		'desc': 'How do magnets work..'
	},
	{
		'name': 'Gordon MacMillan Space Center',
		'lat': 49.275435,
		'lng': -123.143510,
		'desc': 'Space..The Final Frontier!'
	}
];
var markers = [];

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
		markers.push(marker);
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
		for (var i in markers){
			markers[i].setMap(null);
		}
		self.locationsList.removeAll();
		for(i in locations) {
			if (locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.locationsList.push(locations[i]);
				markers[i].setMap(map);
			} else {
				// space for failed search message
			}
		}
	};
	this.getData = function() {
		$.ajax(fourSquare_URL, {
			dataType: 'json',
			//type: 'GET',
			success: function(response){
				console.log(response);
			}
		});
	};
	this.getData();
	this.query.subscribe(this.search);
}

ko.applyBindings(new viewModel());