var map;

// function initMap() {
// 	var vancouver = {lat: 49.2827, lng: -123.1207};
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: vancouver,
// 		zoom: 14,
// 		disableDefaultUI: true
// 	});
// }

function viewModel() {

	function initMap(){
		var options, mapContainer, vancouver

		options = {
			vancouver: {lat: 49.2827, lng: -123.1207},
			center: vancouver,
			zoom: 14,
			disableDefaultUI: true
		};

		mapContainer = document.getElementById('map');

		return new google.maps.Map(options, mapContainer);
	};
}


ko.applyBindings(new viewModel());