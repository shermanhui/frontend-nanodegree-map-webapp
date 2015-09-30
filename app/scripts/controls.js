// Toggles Crawl List
$("#menu-toggle").click(function(e) {
    e.preventDefault();
	if ( $('#directions-container').css('visibility') == 'hidden' ){
		$('#directions-container').css('visibility','visible');
	} else {
		$('#directions-container').css('visibility','hidden');
	}
});

$("#locations-toggle").click(function(e){
	e.preventDefault();
	if ( $('#list').css('visibility') == 'hidden' ){
		$('#list').css('visibility','visible');
	} else {
		$('#list').css('visibility','hidden');
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
			prevKey: 38,
		},
		buttons: {
			$nextButton: false,
			$prevButton: false,
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