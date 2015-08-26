var map, infoWindow, i, bounds;
var CLIENT_ID = 'Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ';
var CLIENT_SECRET = 'NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI';
var fourSquare_URL = 'https://api.foursquare.com/v2/venues/search?near=Vancouver,BC&categoryId=4bf58dd8d48988d116941735&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20150825';
var locName, locAddress, locContact, locLat, locLng;

var myLatlng = {lat: 49.2844, lng: -123.1089};
var markers = [];
var locations = [];
// 	{
// 		'name': 'Steam Clock',
// 		'lat': 49.2844,
// 		'lng': -123.1089,
// 		'desc': "Steam Clock!"
// 	},
// 	{
// 		'name': 'Aquarium',
// 		'lat': 49.301286,
// 		'lng': -123.130843,
// 		'desc': 'Fishies!'
// 	},
// 	{
// 		'name': 'Science World',
// 		'lat': 49.273513,
// 		'lng': -123.103834,
// 		'desc': 'How do magnets work..'
// 	},
// 	{
// 		'name': 'Gordon MacMillan Space Center',
// 		'lat': 49.275435,
// 		'lng': -123.143510,
// 		'desc': 'Space..The Final Frontier!'
// 	}
// ];

// original code from Google Maps API
function initMap() {
	bounds = new google.maps.LatLngBounds();
	infoWindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatlng,
		zoom: 12,
		disableDefaultUI: false
	});
	// for (i = 0; i < locations.length; i++){
	// 	marker = new google.maps.Marker({
	// 	position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
	// 	map: map,
	// 	animation: google.maps.Animation.DROP
	// });
	// 	markers.push(marker);
	// 	google.maps.event.addListener(marker, 'click', (function(marker, i){
	// 		return function(){
	// 			var contentString = getContentString(locations[i]);
	// 			infoWindow.setContent(contentString);
	// 			infoWindow.open(map, marker);
	// 		};
	// 	})(marker, i));
	// }
}

function makeLocationData(data){
	var venueData = data.response.venues;
	var dataLen = venueData.length;
	for (var i = 0; i < dataLen; i++){
		locName = data.response.venues[i].name;
		locAddress = data.response.venues[i].location.address;
		locContact = data.response.venues[i].contact.formattedPhone;
		locLat = data.response.venues[i].location.lat;
		locLng = data.response.venues[i].location.lng;
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locLat, locLng),
			map: map,
			animation: google.maps.Animation.DROP
		});
		locations.push(locName);
		bounds.extend(marker.position);

		google.maps.event.addListener(marker, 'click', (function(marker, i){
			return function(){
				var contentString = getContentString(venueData[i]);
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
			};
		})(marker, i));
		//console.log(data.response.venues[i]);
	}
	console.log(locations);
	map.fitBounds(bounds);
}
//get FourSquare data
// function getData(){
// 	$.ajax(fourSquare_URL, {
// 		dataType: 'json',
// 		async: true,
// 		type: 'GET'
// 		// success: function(data){
// 		// 	makeMarker(data);
// 			// console.log(data.response.venues);
// 			// console.log(data.response.venues[5].name + ', ' + data.response.venues[5].location.address + ', ' + data.response.venues[0].contact.formattedPhone);
// 			// console.log(data.response.venues[5].location.lat, data.response.venues[5].location.lng);
// 	}).done(function(data){
// 		makeMarker(data);
// 	});
// }
console.log(locations);

// content string for infoWindow
var getContentString = function(venueData) {
    var contentString =
    	'<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">'+ venueData.name +'</h1>'+
		'<div id="bodyContent">'+
		'<p><b>Address and Contact</b></p>'+
		'<p>'+ venueData.location.address + ' '+ venueData.contact.formattedPhone + '</p>' +
		'</div>'+
		'</div>';
    return contentString;
};

function viewModel() {
	var self = this;
	this.fsLocals = ko.observableArray([]);
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

	this.ajaxData = function(){
		$.ajax(fourSquare_URL, {
			dataType: 'json',
			async: true,
			type: 'GET'
		}).done(function(data){
			makeLocationData(data);
		});
	};
	this.ajaxData();
	// this.filteredLocations = ko.computed(function(){
	// 	var search = self.query().toLowerCase();
	// 	return ko.utils.arrayFilter(self.filteredLocations, function(locations){
	// 		return locations.name.toLowerCase().indexOf(search) >= 0;
	// 	});
	// }, viewModel);
	this.query.subscribe(this.search);
}
ko.applyBindings(new viewModel());