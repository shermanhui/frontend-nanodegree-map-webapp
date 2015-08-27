var map, infoWindow, i, bounds;
var CLIENT_ID = 'Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ';
var CLIENT_SECRET = 'NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI';
var fourSquare_URL = 'https://api.foursquare.com/v2/venues/search?near=Vancouver,BC&categoryId=4bf58dd8d48988d116941735&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20150825';

var myLatlng = {lat: 49.2844, lng: -123.1089};
var markers = [];
// original code from Google Maps API
function initMap() {
	bounds = new google.maps.LatLngBounds();
	infoWindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatlng,
		zoom: 12,
		disableDefaultUI: false
	});
}

function makeLocationData(data){
	this.locationName = data.name;
	this.locAddress = data.location.address;
	this.locContact = data.contact.formattedPhone;
	this.locLat = data.location.lat;
	this.locLng = data.location.lng;

	return this.locationName;
};

var makeMarker = function(data){
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(locLat, locLng),
		map: map,
		animation: google.maps.Animation.DROP
	});
	bounds.extend(marker.position);

	google.maps.event.addListener(marker, 'click', (function(marker, i){
		return function(){
			var contentString = getContentString(data);
			infoWindow.setContent(contentString);
			infoWindow.open(map, marker);
		};
	})(marker, i));

	map.fitBounds(bounds);
};

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
	this.locationsList = ko.observableArray();
	this.searchList = ko.observableArray(self.locationsList.splice(0));
	this.markers = ko.observableArray();
	this.filter = ko.observable('');

	this.ajaxData = function(){
		$.ajax(fourSquare_URL, {
			dataType: 'json',
			async: true,
			type: 'GET'
		}).done(function(data){
			for (var i = 0; i < 5; i++){
				var info = data.response.venues[i];
				self.locationsList.push(makeLocationData(info));
				makeMarker(info);
			}
			//self.locationsList.push(makeLocationData());
			// console.log(self.locationsList());
		});
	};

	// this.search = function(value) {
	// 	for (var i in markers){
	// 		markers[i].setMap(null);
	// 	}
	// 	self.locationsList.removeAll();
	// 	for(i in locations) {
	// 		if (locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	// 			self.locationsList.push(locations[i]);
	// 			markers[i].setMap(map);
	// 		} else {
	// 			// space for failed search message
	// 		}
	// 	}
	// };
	this.filteredLocations = ko.computed(function(){
		var search = self.filter().toLowerCase();
		if (!search){
			return self.searchList();
		} else{
			return ko.utils.arrayFilter(self.searchList(), function(search){
				return ko.utils.stringStartsWith();
			});
		}
	}, viewModel);

	this.ajaxData();
	// this.query.subscribe(this.search);
}
var viewModel = new viewModel();
ko.applyBindings(viewModel);