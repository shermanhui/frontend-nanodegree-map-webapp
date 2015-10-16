/**
 * Creates interactive Map using data from FourSquare and Instagram to allow users to createa a custom pub crawl route
 * @author Sherman Hui
 * @required knockout.js, panelsnap.js, sweetalert.min.js
 */

'use strict';
/* eslint-env node, jquery */
/* global google, ko, swal, Q, opts, Spinner*/
/* eslint eqeqeq: 0, quotes: 0, no-unused-vars: 0, no-shadow: 0, no-use-before-define: 0*/

var map, geocoder, bounds, directionsService, directionsDisplay, infoWindow, spinner;

var CLIENT_ID = 'Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ';
var CLIENT_SECRET = 'NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI';
var IG_ID = '9143a566adf74c6a999d5e7ddceaebef';
var IG_SECRET = 'bf07f991cd1949be84632dfb7e5ec55b';
var IG_TOKEN = '35149507.9143a56.dbefe25cd56e4059874361a577d8c6c0';
var BAR_ID = '4bf58dd8d48988d116941735';
var BREWERY_ID = '50327c8591d4c4b30a586d5d';

/*
* Represents a Location
* @constructor
* @param {Object} data - FourSquare data includes name, lat/lng, address, rating, marker, icon and category
*/

var Location = function(data, viewModel){
	var self = this;
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.address = ko.observable(data.address);
	this.rating = ko.observable(data.rating);
	this.hours = ko.observable(data.hours);
	this.fsID = ko.observable(data.fsID);
	this.igID = ko.observable(data.igID);
	this.image = ko.observable(data.image);
	this.icon = ko.observable(data.icon);
	this.contentString = // create content string for infoWindow
		'<div class="infowindow-text-center" id="info-content">' +
		'<h1>' + self.name() + '</h1>' +
		'<div>' +
		'<p><b>Address and Rating</b></p>' +
		'<p>' + self.address() + ', FourSquare Rating: ' + self.rating() + '</p>' +
		'<p><b>Latest Instagram</b></p>' +
		'<img width="150" height="150" src= "' + self.image() + '" alt= "Instagram Image Here" />' +
		'<br>' +
		'<button class="btn btn-primary outline gray" data-bind="click: addToRoute">Add</button>' +
		'<button class="btn btn-primary outline gray" data-bind="click: removeFromRoute">Remove</button>' +
		'</div>' +
		'</div>';
	this.marker = viewModel.makeMarker(data, self.contentString);
};

/*
* @function initializes GoogleMaps and its styles
*/
function initMap() {
	infoWindow = new google.maps.InfoWindow();
	geocoder = new google.maps.Geocoder();
	bounds = new google.maps.LatLngBounds();
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.2844, lng: -123.1089},
		zoom: 13,
		disableDefaultUI: true
	});

	var styles = [ // styles google maps api
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

	var styledMap = new google.maps.StyledMapType(styles, // creates new map styles
		{name: "Styled Map"});

	google.maps.event.addDomListener(window, "resize", function() {	// browser resize triggers map resize for responsiveness
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	// adds search bars and list view onto map, sets styled map
	map.controls[google.maps.ControlPosition.LEFT_CENTER].push(document.getElementById('directions-container'));
	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById('placeList'));
	map.mapTypes.set('map_style', styledMap); // sets styles to new styled map
	map.setMapTypeId('map_style'); // gives map a new id
}

/*
* ViewModel for FourSquare API, and Maps data
* @class ViewModel
*
*/
function ViewModel(){
	var self = this;
	this.locationsList = ko.observableArray(); // list to keep track of Locations
	this.markers = ko.observableArray(); // list of markers
	this.crawlList = ko.observableArray(); // list of user selected venues
	this.filter = ko.observable(''); 	// the filter for search bar
	this.isLocked = ko.observable(false); // toggles clear list & reset list button accessibility
	this.locInput = ko.observable('Vancouver, BC');  // user defined location input

	/*
	* @description retrieves relevant Locations from FourSquare API according to user defined location
	* @param {KO Observable} location - technically it's just a string
	*/
	this.loadLocations = function(location){ // takes a user defined location; Vancouver, BC to start with
		var settings = {
			url: 'https://api.foursquare.com/v2/venues/explore?',
			dataType: 'json',
			data: 'limit=30&near=' + location +
				'&categoryId=' + BAR_ID +
				',' + BREWERY_ID +
				'&client_id=' + CLIENT_ID +
				'&client_secret=' + CLIENT_SECRET +
				'&v=20150806&m=foursquare'
			};
		$.ajax(settings)
			.done(function(fsData){
				var response = fsData.response.groups[0].items;
				self.clearData(); // makes sure crawl List and directions display is emptied out on new location search
				self.clearRoute(directionsDisplay); // empties out any previously created route in crawl List
				self.createLocations(response); // creates new list of locations to populate map
			})
			.fail(function(error){
				swal('Uh Oh!', 'There was a problem retrieving the location, please double check your search query!', 'error');
			});
	};

	/*
	* @description centers the map based on the user defined location that is converted into lat/lng by Google Geocode
	* @param {KO Observable} location - a user defined string
	*/
	this.centerMap = function(location){
		geocoder.geocode({'address': location}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK){
				map.setCenter(results[0].geometry.location);
			} else {
				swal('Geocoding your location failed!', 'Geocoder failed because of: ' + status, 'error'); // not necessary b.c line 244 handles bad location queries
			}
		});
	};

	/*
	* @description listens for new user defined location value to update google maps
	*/

	this.searchLocations = ko.computed(function(){ //loads user defined location; default is Vancouver
		var location = self.locInput().toLowerCase();
		self.centerMap(location);
		self.loadLocations(location);
	});

	/*
	* @description takes data from FourSquare API call, makes Location Objects and pushes them into a KO Observable Array, shows a spinner while data loads
	* @param {JSON} response FourSquare API data information used to create Location Objects
	*/

	this.createLocations = function(response){
		var target = document.getElementById('map'); // sets target for spinner
		spinner = new Spinner(opts).spin(target); // invoke spinner with options defined in controls.js onto google maps on new location search
		for (var i = 0; i < response.length; i++) {
			var venue = response[i].venue;
			var venueID = venue.id;
			var venueName = venue.name;
			var venueLoc = venue.location;
			var venueRating = venue.rating;
			var venueIcon = venue.categories[0].icon.prefix + 'bg_32' + venue.categories[0].icon.suffix;
			var obj = {
				name: venueName,
				lat: venueLoc.lat,
				lng: venueLoc.lng,
				address: venueLoc.address,
				rating: venueRating,
				icon: venueIcon,
				fsID: venueID
			};
			self.getIGImage(obj);
		}
	};

	/*
	* @description uses the fs ID to grab an instagram location id then calls getIGImage()
	* @param {Object} Object with FourSquare data
	*/

	this.getInstagramID = function(obj){
		var deferred = Q.defer();

		$.ajax({
			url: 'https://api.instagram.com/v1/locations/search?foursquare_v2_id=' + obj.fsID + '&access_token=' + IG_TOKEN + '',
			dataType: 'jsonp'
		}).done(function(response){
			var status = response.meta.code;
			if (status === 200){
				var instagramID = response.data[0].id;
				obj.igID = instagramID;
				deferred.resolve(obj);
			} else {
				deferred.reject(new Error("IG API failed"));
			}
		}).fail(function(reponse) {
			var error = new Error("Ajax request for IG ID failed");
			deferred.reject(error);
		});

		return deferred.promise;
	};

	/*
	* @description uses the instagram location ID to retrieve the relevant instagram image
	* @param {Object} Object with FourSquare data and Instagram ID
	*/

	this.getIGImage = function(obj){
		var self = this;
		self.getInstagramID(obj).then(function(obj){
			$.ajax({
				url: 'https://api.instagram.com/v1/locations/' + obj.igID + '/media/recent?&access_token=' + IG_TOKEN + '',
				dataType: 'jsonp'
			}).done(function(response){
				obj.image = response.data[0].images.standard_resolution.url;
				self.locationsList().push(new Location(obj, self));
			}).fail(function(){
				swal('Sorry!', 'There was a problem retrieving the Instagram Image :(', 'error');
			});
		}).catch(function(error){
			swal('Sorry!', 'There was a problem, ' + error, 'error');
		}).then(function(){
			spinner.stop();
		});
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
	* @description makes a marker for each location object produced by the ajax call, extends the map to fit all markers and opens infowindows on marker click
	* @param {object} object with FourSquare location data such as icon image, lat, lng, and location name
	* @param {string} DOM elements for InfoWindow content
	* @returns {Google Map Marker} Markers populate on google map with respective icons at respective lat lng
	*/

	this.makeMarker = function(data, contentString){
		var myLatLng = new google.maps.LatLng(data.lat, data.lng);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: data.name,
			icon: data.icon
		});

		self.markers.push(marker); // pushes a marker into the array of markers to be tracked on search

		google.maps.event.addListener(marker, 'click', (function(marker, contentString) {
			return function() {
				var thisMarker = this;
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
				thisMarker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){
					thisMarker.setAnimation(null);
				}, 750);
			};
		})(marker, contentString));
	};

	/*
	* @description does similar job to above function, but is invoked when user resets the map markers after making a route, bounding works in this function
	* @returns {Google Map Marker} Markers populate on google map with respective icons at respective lat lng
	*/

	this.resetMarkers = function(){
		// for each Location plant a marker at the given lat,lng and on click show the info window
		self.locationsList().forEach(function(place){
			var myLatLng = new google.maps.LatLng(place.lat(), place.lng());
			var marker = new google.maps.Marker({
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
					var thisMarker = this;
					infoWindow.setContent(place.contentString);
					infoWindow.open(map, marker);
					thisMarker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function(){
						thisMarker.setAnimation(null);
					}, 750);
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
				self.stopMarker(currentMarker); // calls this.stopMarker to halt bouncing marker
			}
		}
	};

	/*
	* @description set timeout function for marker to stop bouncing
	* @param {google.maps.Marker} marker - takes a google maps marker
	*/

	this.stopMarker = function(currentMarker){
		setTimeout(function(){
			currentMarker.setAnimation(null);
		}, 750);
	};

	/*
	* @description adds user selected location to crawl list, prevents adding the same location twice
	* @param {object} place - Location Object Name is used as id
	*/

	this.addToRoute = function(place){ // takes in a location object and adds it to crawlList so user can create a route
		if (!($.inArray(place, self.crawlList()) > -1)){  // checks for duplicate locations, JShint throws an error here, but functionality will not be the same if I remove brackets
			self.crawlList.push(place);
		} else {
			swal('Sorry!', 'This location has already been added to the list!', 'error');
		}
	};

	/*
	* @description removes selected Location from crawlList, if applicable
	* @param {object} place - Location Object's name is used
	*/

	this.removeFromRoute = function(place){ // removes location from list
		if ($.inArray(place, self.crawlList()) > -1){  // checks for duplicate locations
			self.crawlList.remove(place);
		} else {
			swal('Try Again!', 'This location has not been added to the list yet!', 'error');
		}
	};

	/*
	* @description stores user selected locations as waypoints, creates a route on Map and creates a list of directions
	* @param {google.maps.DirectionsService} Google directionsService - creates directions on map
	* @param {google.maps.DirectionsRenderer} Google directionsDisplay - creates a list of directions
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
			waypoints: waypoints.slice(1, waypoints.length - 1),
			optimizeWaypoints: false,
			travelMode: google.maps.TravelMode.WALKING
		}, function(response, status){
			if (status === google.maps.DirectionsStatus.OK){
				window.directionsDisplay.setDirections(response);
			} else {
				swal('Hmm..', 'Directions request failed due to ' + status + ', please try again!', 'error');
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
				marker.setVisible(false);
			});
			self.isLocked(true);
		} else {
			swal('Actually..', 'You need atleast 2 locations to create a route and are limited to 8 locations, try again!', 'error');
		}
	};

	/*
	* @description removes all items in crawlList on button click
	*/

	this.emptyCrawlList = function(){
		self.crawlList.removeAll();
	};

	/*
	* @description clears map markers, user added locations, resets location markers, clears directionsDisplay and relocks the button
	* @param {google.maps.DirectionsDisplay} directionsDisplay - directions that are displayed on screen
	*/

	this.clearRoute = function(directionsDisplay){ //remakes markers, removes last crawlList
		self.crawlList.removeAll();
		self.resetMarkers();
		if (directionsDisplay != null){ //JShint throws an error here, but code will break if I use "!=="
			window.directionsDisplay.setMap(null);
			window.directionsDisplay.setPanel(null);
			self.isLocked(false);
		}
	};

	/*
	* @description sets each marker in self.markers() to be visible, used in this.searchFilter()
	*/

	this.showMarker = function(){
		self.markers().forEach(function(marker){
			marker.setVisible(true);
		});
	};

	/*
	* @description filters list and marker according to user input
	* @returns self.locationsList or all places that match any part of self.filter()
	*/

	this.searchFilter = ko.computed(function(){
		var filter = self.filter().toLowerCase();
		if (!filter){
			self.showMarker(); // sets all markers to be visible
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

function startAll(){
	initMap(); // initialize the map

	var viewModel = new ViewModel(); // define then bind viewModel
	ko.applyBindings(viewModel);
}
