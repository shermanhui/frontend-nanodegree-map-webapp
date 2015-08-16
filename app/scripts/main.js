var map;

// function initMap() {
// 	var vancouver = {lat: 49.2827, lng: -123.1207};
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: vancouver,
// 		zoom: 14,
// 		disableDefaultUI: true
// 	});
// }

// var initLocations = [
// 	{
// 		"name": "Vancouver",
// 		"lat": 49.2827,
// 		"lng": -123.1207
// 	}	
// ];

// var Location = function(data){
// 	this.name = ko.observable(data.name);
// 	this.lat = ko.observable(data.lat);
// 	this.lng = ko.observable(data.lng);
// };

function viewModel() {
	var self = this;
	function initMap(){
		var options, mapContainer, vancouver;

		vancouver = {lat: 49.2827, lng: -123.1207};
		mapContainer = document.getElementById('map');

		map = google.maps.Map(options, mapContainer);
		options = {
			center: vancouver,
			zoom: 14,
			disableDefaultUI: true
		};

		return new google.maps.Map(options, mapContainer);
	};

}



ko.applyBindings(new viewModel());