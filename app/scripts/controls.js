'use strict';
/* eslint-env node, jquery */
/* global swal, opts */
/* eslint eqeqeq: 0 no-unused-vars: 0*/

// options for spin.js spinner
var opts = {
	lines: 13, // The number of lines to draw
	length: 28, // The length of each line
	width: 14, // The line thickness
	radius: 42, // The radius of the inner circle
	scale: 1, // Scales overall size of the spinner
	corners: 1, // Corner roundness (0..1)
	color: '#000', // #rgb or #rrggbb or array of colors
	opacity: 0.25, // Opacity of the lines
	rotate: 0, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	className: 'spinner', // The CSS class to assign to the spinner
	top: '50%', // Top position relative to parent
	left: '50%', // Left position relative to parent
	shadow: false, // Whether to render a shadow
	hwaccel: true, // Whether to use hardware acceleration
	position: 'absolute' // Element positioning
};

// Toggles Crawl List
$('#menu-toggle').click(function(e) {
    e.preventDefault();
	if ( $('#directions-container').css('visibility') == 'hidden' ){
		$('#directions-container').css('visibility', 'visible');
	} else {
		$('#directions-container').css('visibility', 'hidden');
	}
});

$('#locations-toggle').click(function(e){
	e.preventDefault();
	if ( $('#placeList').css('visibility') == 'hidden' ){
		$('#placeList').css('visibility', 'visible');
	} else {
		$('#placeList').css('visibility', 'hidden');
	}
});

// calls panelSnap.js and sets up snap functions
var options = {
  $menu: false,
	menuSelector: 'a',
	panelSelector: '> section',
	namespace: '.panelSnap',
	onSnapStart: function(){},
	onSnapFinish: function(){},
	onActivate: function(){},
	directionThreshold: 1000,
	slideSpeed: 300,
	delay: 0,
	easing: 'linear',
	offset: 0,
	strictContainerSelection: false,
	navigation: {
		keys: {
			nextKey: 40,
			prevKey: 38
		},
		buttons: {
			$nextButton: false,
			$prevButton: false
		},
		wrapAround: false
	}
};

$('body').panelSnap(options);

$('#hero-btn').on('click', function() {
      $('body').panelSnap('snapTo', 'next');
});

$('#global-search-about').keypress(function(event) {
	if (event.keyCode == 13){
		$('body').panelSnap('snapTo', 'next');
	}
});

// sweetAlert Confirm Button Styling
swal.setDefaults({ confirmButtonColor: '#d3d3d3' });
