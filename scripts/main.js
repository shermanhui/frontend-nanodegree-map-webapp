"use strict";function initMap(){infoWindow=new google.maps.InfoWindow,geocoder=new google.maps.Geocoder,bounds=new google.maps.LatLngBounds,map=new google.maps.Map(document.getElementById("map"),{center:{lat:49.2844,lng:-123.1089},zoom:13,disableDefaultUI:!0});var e=[{elementType:"labels",stylers:[{visibility:"on"}]},{elementType:"labels.text.stroke",stylers:[{visibility:"off"},{color:"#ffffff"},{lightness:16}]},{elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#333333"},{lightness:40}]},{elementType:"geometry",stylers:[{visibility:"on"}]},{featureType:"road",elementType:"geometry",stylers:[{visibility:"on"},{color:"#000000"},{weight:.2}]},{featureType:"landscape",stylers:[{color:"#ffffff"},{visibility:"on"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#e9e9e9"},{lightness:17}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:21}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:21}]},{featureType:"administrative",stylers:[{visibility:"off"}]}],t=new google.maps.StyledMapType(e,{name:"Styled Map"});google.maps.event.addDomListener(window,"resize",function(){var e=map.getCenter();google.maps.event.trigger(map,"resize"),map.setCenter(e)}),map.controls[google.maps.ControlPosition.LEFT_CENTER].push(document.getElementById("directions-container")),map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById("placeList")),map.mapTypes.set("map_style",t),map.setMapTypeId("map_style")}function ViewModel(){var e=this;this.locationsList=ko.observableArray(),this.markers=ko.observableArray(),this.crawlList=ko.observableArray(),this.filter=ko.observable(""),this.isLocked=ko.observable(!1),this.locInput=ko.observable("Vancouver, BC"),this.loadLocations=function(t){var o={url:"https://api.foursquare.com/v2/venues/explore?",dataType:"json",data:"limit=30&near="+t+"&categoryId="+BAR_ID+","+BREWERY_ID+"&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&v=20150806&m=foursquare"};$.ajax(o).done(function(t){var o=t.response.groups[0].items;e.clearData(),e.clearRoute(directionsDisplay),e.createLocations(o)}).fail(function(e){swal("Uh Oh!","There was a problem retrieving the location, please double check your search query!","error")})},this.centerMap=function(e){geocoder.geocode({address:e},function(e,t){t==google.maps.GeocoderStatus.OK?map.setCenter(e[0].geometry.location):swal("Geocoding your location failed!","Geocoder failed because of: "+t,"error")})},this.searchLocations=ko.computed(function(){var t=e.locInput().toLowerCase();e.centerMap(t),e.loadLocations(t)}),this.createLocations=function(t){var o=document.getElementById("map");spinner=new Spinner(opts).spin(o);for(var i=0;i<t.length;i++){var n=t[i].venue,a=n.id,s=n.name,r=n.location,l=n.rating,c=n.categories[0].icon.prefix+"bg_32"+n.categories[0].icon.suffix,d={name:s,lat:r.lat,lng:r.lng,address:r.address,rating:l,icon:c,fsID:a};e.getIGImage(d)}},this.getInstagramID=function(e){var t=Q.defer();return $.ajax({url:"https://api.instagram.com/v1/locations/search?foursquare_v2_id="+e.fsID+"&access_token="+IG_TOKEN,dataType:"jsonp"}).done(function(o){var i=o.meta.code;if(200===i){var n=o.data[0].id;e.igID=n,t.resolve(e)}else t.reject(new Error("IG API failed"))}).fail(function(e){var o=new Error("Ajax request for IG ID failed");t.reject(o)}),t.promise},this.getIGImage=function(t){e.getInstagramID(t).then(function(t){$.ajax({url:"https://api.instagram.com/v1/locations/"+t.igID+"/media/recent?&access_token="+IG_TOKEN,dataType:"jsonp"}).done(function(o){t.image=o.data[0].images.standard_resolution.url,e.locationsList().push(new Location(t))}).fail(function(){swal("Sorry!","There was a problem retrieving the Instagram Image :(","error")})})["catch"](function(e){swal("Sorry!","There was a problem, "+e,"error")}).then(function(){spinner.stop()})},this.clearData=function(){e.markers().forEach(function(e){e.setMap(null)}),e.locationsList.removeAll()},this.makeMarker=function(t,o){var i=new google.maps.LatLng(t.lat,t.lng),n=new google.maps.Marker({position:i,map:map,title:t.name,icon:t.icon});e.markers.push(n),google.maps.event.addListener(n,"click",function(e,t){return function(){var o=this;infoWindow.setContent(t),infoWindow.open(map,e),o.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){o.setAnimation(null)},750)}}(n,o))},this.resetMarkers=function(){e.locationsList().forEach(function(t){var o=new google.maps.LatLng(t.lat(),t.lng()),i=new google.maps.Marker({position:o,map:map,title:t.name(),icon:t.icon()});bounds.extend(o),t.marker=i,e.markers.push(i),google.maps.event.addListener(i,"click",function(e,t){return function(){var o=this;infoWindow.setContent(t.contentString),infoWindow.open(map,e),o.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){o.setAnimation(null)},750)}}(i,t)),map.fitBounds(bounds)})},this.openFromList=function(t){for(var o=t.name(),i=e.markers().length,n=0;i>n;n++)if(o===e.markers()[n].title){var a=e.markers()[n];map.panTo(a.position),map.setZoom(14),infoWindow.setContent(t.contentString),infoWindow.open(map,a),a.setAnimation(google.maps.Animation.BOUNCE),e.stopMarker(a)}},this.stopMarker=function(e){setTimeout(function(){e.setAnimation(null)},750)},this.addToRoute=function(t){$.inArray(t,e.crawlList())>-1?swal("Sorry!","This location has already been added to the list!","error"):e.crawlList.push(t)},this.removeFromRoute=function(t){$.inArray(t,e.crawlList())>-1?e.crawlList.remove(t):swal("Try Again!","This location has not been added to the list yet!","error")},this.calculateAndDisplayRoute=function(t,o){window.directionsService=new google.maps.DirectionsService,window.directionsDisplay=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"#5cb85c"}});for(var i=[],n=0;n<e.crawlList().length;n++){var a=e.crawlList()[n].lat(),s=e.crawlList()[n].lng();i.push({location:{lat:a,lng:s},stopover:!0})}window.directionsService.route({origin:i[0].location,destination:i[i.length-1].location,waypoints:i.slice(1,i.length-1),optimizeWaypoints:!1,travelMode:google.maps.TravelMode.WALKING},function(e,t){t===google.maps.DirectionsStatus.OK?window.directionsDisplay.setDirections(e):swal("Hmm..","Directions request failed due to "+t+", please try again!","error")}),window.directionsDisplay.setMap(map),window.directionsDisplay.setPanel(document.getElementById("directions-panel"))},this.makeRoute=function(){e.crawlList().length>1&&e.crawlList().length<8?(e.calculateAndDisplayRoute(directionsService,directionsDisplay),e.markers().forEach(function(e){e.setVisible(!1)}),e.isLocked(!0)):swal("Actually..","You need atleast 2 locations to create a route and are limited to 8 locations, try again!","error")},this.emptyCrawlList=function(){e.crawlList.removeAll()},this.clearRoute=function(t){e.crawlList.removeAll(),e.resetMarkers(),null!=t&&(window.directionsDisplay.setMap(null),window.directionsDisplay.setPanel(null),e.isLocked(!1))},this.showMarker=function(){e.markers().forEach(function(e){e.setVisible(!0)})},this.searchFilter=ko.computed(function(){var t=e.filter().toLowerCase();return t?ko.utils.arrayFilter(e.locationsList(),function(o){for(var i=0;i<e.markers().length;i++)e.markers()[i].setVisible(-1!==e.markers()[i].title.toLowerCase().indexOf(t)?!0:!1);return-1!==o.name().toLowerCase().indexOf(t)}):(e.showMarker(),infoWindow.close(),e.locationsList())})}var map,geocoder,bounds,directionsService,directionsDisplay,infoWindow,spinner,CLIENT_ID="Q0A4REVEI2V22KG4IS14LYKMMSRQTVSC2R54Y3DQSMN1ZRHZ",CLIENT_SECRET="NPWADVEQHB54FWUKETIZQJB5M2CRTPGRTSRICLZEQDYMI2JI",IG_ID="9143a566adf74c6a999d5e7ddceaebef",IG_SECRET="bf07f991cd1949be84632dfb7e5ec55b",IG_TOKEN="35149507.9143a56.dbefe25cd56e4059874361a577d8c6c0",BAR_ID="4bf58dd8d48988d116941735",BREWERY_ID="50327c8591d4c4b30a586d5d",Location=function(e){var t=this;this.name=ko.observable(e.name),this.lat=ko.observable(e.lat),this.lng=ko.observable(e.lng),this.address=ko.observable(e.address),this.rating=ko.observable(e.rating),this.hours=ko.observable(e.hours),this.fsID=ko.observable(e.fsID),this.igID=ko.observable(e.igID),this.image=ko.observable(e.image),this.icon=ko.observable(e.icon),this.contentString='<div class="text-center" id="content"><h1>'+t.name()+"</h1><div><p><b>Address and Rating</b></p><p>"+t.address()+", FourSquare Rating: "+t.rating()+'</p><p><b>Latest Instagram</b></p><img width="150" height="150" src= "'+t.image()+'" alt= "Instagram Image Here" /><br><button class="btn btn-primary outline gray" data-bind="click: addToRoute">Add</button><button class="btn btn-primary outline gray" data-bind="click: removeFromRoute">Remove</button></div></div>',this.marker=viewModel.makeMarker(e,t.contentString)};initMap();var viewModel=new ViewModel;ko.applyBindings(viewModel);var opts={lines:13,length:28,width:14,radius:42,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:60,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!0,position:"absolute"};$("#menu-toggle").click(function(e){e.preventDefault(),"hidden"==$("#directions-container").css("visibility")?$("#directions-container").css("visibility","visible"):$("#directions-container").css("visibility","hidden")}),$("#locations-toggle").click(function(e){e.preventDefault(),"hidden"==$("#placeList").css("visibility")?$("#placeList").css("visibility","visible"):$("#placeList").css("visibility","hidden")});var options={$menu:!1,menuSelector:"a",panelSelector:"> section",namespace:".panelSnap",onSnapStart:function(){},onSnapFinish:function(){},onActivate:function(){},directionThreshold:1e3,slideSpeed:300,delay:0,easing:"linear",offset:0,strictContainerSelection:!1,navigation:{keys:{nextKey:40,prevKey:38},buttons:{$nextButton:!1,$prevButton:!1},wrapAround:!1}};$("body").panelSnap(options),$("#hero-btn").on("click",function(){$("body").panelSnap("snapTo","next")}),$("#global-search-about").keypress(function(e){13==e.keyCode&&$("body").panelSnap("snapTo","next")}),swal.setDefaults({confirmButtonColor:"#d3d3d3"});