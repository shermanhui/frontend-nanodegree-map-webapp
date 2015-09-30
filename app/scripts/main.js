var map, marker, bounds, directionsService, directionsDisplay;
var infoWindow = new google.maps.InfoWindow();

var CLIENT_ID = 'Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ';
var CLIENT_SECRET = 'NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI';
var BAR_ID = '4bf58dd8d48988d116941735';
var BREWERY_ID = '50327c8591d4c4b30a586d5d';

/*
* Represents a Location
* @constructor
* @param {JSON} data
*/

var Location = function(data){
	var self = this;
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.address = ko.observable(data.address);
	this.rating = ko.observable(data.rating);
	this.marker = ko.observableArray(data.marker);
	this.category = ko.observable(data.category);
	this.icon = ko.observable(data.icon);

	this.contentString = // create content string for infoWindow
		'<div class="text-center" id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">'+ self.name() +'</h1>'+
		'<div id="bodyContent">'+
		'<p><b>Address and Rating</b></p>'+
		'<p>'+ self.address() + ', FourSquare Rating: '+ self.rating() + '</p>' +
		'<button class="add btn btn-primary outline gray" data-bind="click: $parent.addToRoute">Add</button>' +
		'<button class="remove btn btn-primary outline gray" data-bind="click: $parent.removeFromRoute">Remove</button>' +
		'</div>'+
		'</div>';
};

/*
* @function initializes GoogleMaps and its styles
*/
function initMap() {
	bounds = new google.maps.LatLngBounds();
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.2844, lng: -123.1089},
		disableDefaultUI: true
	});

	// styles google maps api
	var styles =[
		{
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "on"
				}
			]
		},
		{
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"color": "#ffffff"
				},
				{
					"lightness": 16
				}
			]
		},
		{
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"saturation": 36
				},
				{
					"color": "#333333"
				},
				{
					"lightness": 40
				}
			]
		},
		{
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#000000"
				},
				{
					"weight": 0.2
				}
			]
		},
		{
			"featureType": "landscape",
			"stylers": [
				{
					"color": "#ffffff"
				},
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#e9e9e9"
				},
				{
					"lightness": 17
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#f5f5f5"
				},
				{
					"lightness": 21
				}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dedede"
				},
				{
					"lightness": 21
				}
			]
		},
		{
			"featureType": "administrative",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		}
	];

	var styledMap = new google.maps.StyledMapType(styles,
    	{name: "Styled Map"});

	google.maps.event.addDomListener(window, "resize", function() {	// browser resize triggers map resize for responsiveness
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	// adds search bars and list view onto map, sets styled map
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('map-buttons'));
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('map-inputs'));
	map.controls[google.maps.ControlPosition.LEFT_CENTER].push(document.getElementById('directions-container'));
	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById('list'));
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}

/*
* viewModel for FourSquare API, and Maps data
* @class viewModel
*
*/
function viewModel(){
	var self = this;
	this.locationsList = ko.observableArray(); // list to keep track of Locations
	this.markers = ko.observableArray(); // list of markers
	this.crawlList = ko.observableArray(); // list of user selected venues
	this.filter = ko.observable(''); 	// the filter for search bar
	this.isLocked= ko.observable(false); // toggles clear list & reset list button accessibility
	this.locInput = ko.observable('Vancouver, BC');  // user defined location input

	/*
	* @description retrieves relevant Locations from FourSquare API according to user defined location
	* @param {KO Observable} location a user defined KO Observable
	*/
	this.loadLocations = function(location){ // takes a user defined location; Vancouver, BC to start with
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?',
			dataType: 'json',
			data: 'limit=30&near=' + location +
				'&categoryId=' + BAR_ID +
				',' + BREWERY_ID +
				'&client_id=' + CLIENT_ID +
				'&client_secret=' + CLIENT_SECRET +
				'&v=20150806&m=foursquare',
			success: function(fsData){
				var response = fsData.response.groups[0].items;
				self.clearData(); // makes sure crawl List and directions display is emptied out on new location search
				self.clearRoute(directionsDisplay); // empties out any previously created route in crawl List
				self.createLocations(response); // creates new list of locations to populate map
				map.setCenter({lat: self.locationsList()[5].lat(), lng: self.locationsList()[15].lng()}); // hacky way of getting map to re-center on new search
				map.setZoom(13);
			},
			error: function(error){
				alert('There was a problem retrieving the requested data, please double check your location');
			}
		});
	};

	/*
	* @description listens for new user defined location value to update google maps
	*/

	this.searchLocations = ko.computed(function(){ //loads user defined location; default is Vancouver
		var location = self.locInput().toLowerCase();
		self.loadLocations(location);
	});

	/*
	* @description takes data from FourSquare API call, makes Location Objects and pushes them into a KO Observable Array, also make map markers
	* @param {JSON} response FourSquare API data information used to create Location Objects
	*/
	this.createLocations = function(response){
		for (var i = 0; i < response.length; i++) {
			var venue = response[i].venue;
			var venueName = venue.name;
			var venueLoc = venue.location;
			var venueRating = venue.rating;
			var venueCategory = venue.categories[0].id;
			var venueIcon = venue.categories[0].icon.prefix + 'bg_32' + venue.categories[0].icon.suffix;
			var obj = {
				name: venueName,
				lat: venueLoc.lat,
				lng: venueLoc.lng,
				address: venueLoc.address,
				rating: venueRating,
				category: venueCategory,
				icon: venueIcon
			};
			self.locationsList.push(new Location(obj));
		}
		self.makeMarkers();
	};

	/*
	* @description clears map of all markers and removes all previous Locations
	*/

	this.clearData = function(){ //clears map data on new location search
		self.markers().forEach(function(marker){
			marker.setMap(null);
		});
		self.locationsList.removeAll();
	};

	/*
	* @description makes a marker for each Location produced by the ajax call, extends the map to fit all markers and opens infowindows on marker click
	*/

	this.makeMarkers = function(){
		// for each Location plant a marker at the given lat,lng and on click show the info window
		self.locationsList().forEach(function(place){
			var myLatLng = new google.maps.LatLng(place.lat(), place.lng());
			marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				title: place.name(),
				icon: place.icon()
			});
			bounds.extend(myLatLng); // extends map bounds to make markers fit on map
			place.marker = marker; // makes a marker property for each Location object in self.locationsList()
			self.markers.push(marker); // pushes a marker into the array of markers to be tracked on search

			google.maps.event.addListener(marker, 'click', (function(marker, place) {
				return function() {
					var self = this;
					infoWindow.setContent(place.contentString);
					infoWindow.open(map, marker);
					self.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function(){self.setAnimation(null);}, 750);
				};
			})(marker, place));
			map.fitBounds(bounds);
		});
	};

	/*
	* @description allows user to open Info Windows from the List View using a Location's name; will pan to location and open respective info window
	* @param {object} place - Location Object
	*/

	this.openFromList = function(place){ // takes in the relevant Location Object
		var listItem = place.name(); // pulls the Location name from clicked list item
		var len = self.markers().length;
		for (var i = 0; i < len; i++){
			if (listItem === self.markers()[i].title){ // If the clicked list item's name matches a relevant marker, then we display the infoWindow
				var currentMarker = self.markers()[i];
				map.panTo(currentMarker.position); // pans to marker
				map.setZoom(14);
				infoWindow.setContent(place.contentString);
				infoWindow.open(map, currentMarker);
				currentMarker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){currentMarker.setAnimation(null);}, 750);
			}
		}
	};

	/*
	* @description adds user selected location to crawl list to make and draw directions on map, prevents adding the same location twice
	* @param {object} place - Location Object Name is used as id, and then if it matches the Location on file, it is added to self.crawlList
	*/

	this.addToRoute = function(place){ // takes in a location object and adds it to crawlList so user can create a route
		if (!($.inArray(place, self.crawlList()) > -1)){  // checks for duplicate locations, JShint throws an error here, but functionality will not be the same if I remove brackets
			self.crawlList.push(place);
		} else {
			alert('This location has already been added to the list!');
		}
	};

	/*
	* @description removes selected Location from crawlList, if applicable
	* @param {object} place - Location Object
	*/

	this.removeFromRoute = function(place){ // removes location from list
		if ($.inArray(place, self.crawlList()) > -1){  // checks for duplicate locations
			self.crawlList.remove(place);
		} else {
			alert('This location has not been added to the list yet!');
		}
	};

	/*
	* @description takes user defined locations and creates a route, pins route and directions onto window
	* @param {object} Google Directions API
	* @param {object} Google Directions API
	*/

	this.calculateAndDisplayRoute = function(directionsService, directionsDisplay){
		window.directionsService = new google.maps.DirectionsService();
		window.directionsDisplay = new google.maps.DirectionsRenderer({polylineOptions: { strokeColor: '#5cb85c' }}); // green color for Directions line

		var waypoints = [];
		for (var i = 0; i < self.crawlList().length; i++){
			var venueLat = self.crawlList()[i].lat();
			var venueLng = self.crawlList()[i].lng();
			waypoints.push({
				location: {lat: venueLat, lng: venueLng},
				stopover: true
			});
		}

		window.directionsService.route({
			origin: waypoints[0].location,// sets origin as first way point, this is causing the directions panel bug
			destination: waypoints[waypoints.length - 1].location, // set last waypoint as destination, causing duplicate location on directions panel
			waypoints: waypoints.slice(1, waypoints.length -1),
			optimizeWaypoints: false,
			travelMode: google.maps.TravelMode.WALKING
		}, function(response, status){
			if (status === google.maps.DirectionsStatus.OK){
				window.directionsDisplay.setDirections(response);
				var route = response.routes[0];
			} else {
				alert('Directions request failed due to ' + status + ', please try again!');
			}
		});

		window.directionsDisplay.setMap(map);
		window.directionsDisplay.setPanel(document.getElementById('directions-panel'));
	};

	/*
	* @description allows User to create a route and draws it on the map, calls self.calculateAndDisplayRoute
	*/

	this.makeRoute = function(){
		if (self.crawlList().length > 1 && self.crawlList().length < 8){
			self.calculateAndDisplayRoute(directionsService, directionsDisplay);
			self.markers().forEach(function(marker){
				marker.setMap(null);
			});
			self.isLocked(true);
		} else {
			alert('You need atleast 2 locations to create a route and are limited to 8 locations');
		}
	};

	/*
	* @description removes all items in crawlList on button click
	*/

	this.emptyCrawlList = function(){
		self.crawlList.removeAll();
	};

	/*
	* @description clears map markers, user added locations and resets location markers and relocks the button
	* @param {object} directionsDisplay - directions that are displayed on screen
	*/

	this.clearRoute = function(directionsDisplay){ //remakes markers, removes last crawlList
		self.crawlList.removeAll();
		self.makeMarkers();
		if (directionsDisplay != null){ //JShint throws an error here, but code will break if I use "!=="
			window.directionsDisplay.setMap(null);
			window.directionsDisplay.setPanel(null);
			self.isLocked(false);
		}
	};

	/*
	* @description sets each marker in self.markers() to be visible
	*/

	this.setMarker = function(){
		for (var i = 0; i < self.markers().length; i++){
			self.markers()[i].setVisible(true);
		}
	};

	/*
	* @description filters list and marker according to user input
	* @returns self.locationsList or all places that match the user defined location
	*/

	this.searchFilter = ko.computed(function(){
		var filter = self.filter().toLowerCase();
		if (!filter){
			self.setMarker(); // sets all markers to be visible
			infoWindow.close(); // closes all infowindows on search
			return self.locationsList(); // returns all locations in self.locationsList
		} else {
			return ko.utils.arrayFilter(self.locationsList(), function(place){
				for (var i = 0; i < self.markers().length; i++){ // for every marker if the title of the marker matches the filter set markers to visible
					if (self.markers()[i].title.toLowerCase().indexOf(filter) !== -1){
						self.markers()[i].setVisible(true);
					} else { // everything else, set it to false
						self.markers()[i].setVisible(false);
					}
				}
				return place.name().toLowerCase().indexOf(filter) !== -1; // returns matched list names
			});
		}
	});
}
// initialize the map
initMap();
// bind KO
var viewModel = new viewModel();
ko.applyBindings(viewModel);