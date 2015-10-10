# frontend-nanodegree-map-webapp

## How To Use:

- Download from github.com/shui91/frontend-nanodegree-map-webapp (master branch)
- `cd` to the directory and run `npm install` and `bower install` to make sure you have the latest dependancies
- run `gulp serve` to run the test version or `gulp serve:dist` for a production version of the webapp
- In the webapp click on "Get Started"
- List of bars/breweries in Vancouver, BC open up as default.
- User may search for their own location to load FourSquare's recommended drinking holes
- Locations are marked as Breweries (Barrels) and Pubs(Beer Glasses).
- Users can add/remove specific venues to their crawl list
- Users can clear the list
- Users can click "Create Crawl" to generate a directions list to plan their pub crawl!

## Personal Objectives

Tools:
- Knockout
- HTML5 BoilerPlate
- Bower
- Gulp
- jQuery Plugins

To-Dos to Meet Project Expectations:
- ~~Responsive Design for Mobile~~
    - ~~Cohesive and enjoyable user experience~~
- ~~Search Bar: filters both list view and markers~~
- ~~List View: filters through searched locations and opens associated marker~~
- ~~"Unique Functionality"~~
    - ~~Route making counts...right?~~
- ~~Incorporate Build Process~~
    - ~~Production quality minified code~~
- Data persists when app is opened and closed
    - Firebase/localStorage
- ~~Populates dynamic model with info retrieved from API~~
- ~~Error handling for API~~
- Include third-party API beyond what's required
- ~~Style marker differently and usefully~~
- Search function is optimized and provides things like autocomplete
- ~~README file detailing steps on how to run the project~~
- ~~Comments are concise and self documenting~~
- ~~Code ready for personal review~~
- ~~Menu~~

To-Dos for the Future:
- Close InfoWindows on List View Search
- Users can add/remove locations directly from infowindow

## How will I complete this Project?

- Review our course [JavaScript Design Patterns] (https://www.udacity.com/course/ud989-nd).
- Download the [Knockout framework] (http://knockoutjs.com/).
- Write code required to add a full-screen map to your page using the [Google Maps API] (https://developers.google.com/maps/).
- Write code required to add map markers identifying a number of locations you are interested in within this neighborhood.
- Implement the search bar functionality to search and filter your map markers. There should be a filtering function on markers that already show up. Simply providing a search function through a third-party API is not enough.
- Implement a list view of the identified locations.
- Add additional functionality using third-party APIs when a map marker, search result, or list view entry is clicked (ex. Yelp reviews, Wikipedia, Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our [Intro to AJAX course](https://www.udacity.com/course/ud110-nd).

## Issues

- Unfortunately, due to FourSquare's broad "Pub" Category ID '4bf58dd8d48988d116941735', there are sometimes other night life locations thrown in, reducing the effectiveness of the location icons
	- Location Icons disappear on Route Creation, because Google Maps Directions uses its own markers
- Currently users can NOT add/remove from InfoWindow, to be implemented in the future
- InfoWindows don't close on list view search

## Helpful Resources

None of these are required, but they may be helpful.
- [Foursquare API] (https://developer.foursquare.com/start)
- [MediaWikiAPI for Wikipedia] (http://www.mediawiki.org/wiki/API%3aMain_page)
- [Google Maps Street View Service] (https://developers.google.com/maps/documentation/javascript/streetview)
- [Google Maps] (https://developers.google.com/maps/documentation/)

## Resources Used

- [Google Maps Responsive Resize] (http://stackoverflow.com/questions/18444161/google-maps-responsive-resize)
- [Setting Markers Visible/Invisible] (http://stackoverflow.com/questions/6502566/google-markers-setvisible-true-false-show-hide)
- [Live Search With Knockout] (http://opensoul.org/2011/06/23/live-search-with-knockoutjs/)
- [Live Search Fiddle] (http://jsfiddle.net/mythical/XJEzc/)
- [How To Overlay a Div On Google Maps] (http://stackoverflow.com/questions/21181211/how-to-overlay-a-div-on-a-map)
- [Prevent Clicks on Knockout Buttons] (http://stackoverflow.com/questions/10306883/prevent-a-double-click-on-a-button-with-knockout-js)
- [Check for Obj in Array] (http://stackoverflow.com/questions/237104/array-containsobj-in-javascript)
- [PanelSnap JS] (http://guidobouman.github.io/jquery-panelsnap/)
- [SweetAlert JS for alert divs] (https://github.com/t4t5/sweetalert)
- [Google Maps Style Wizard] (http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html?utm_medium=twitter)
- [How To Center Using An Address On Initialize] (http://stackoverflow.com/questions/6140303/google-maps-v3-how-to-center-using-an-address-on-initialize)

## Project Overview

You will develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

## Why this Project?

The neighborhood tour application is complex enough and incorporates a variety of data points that it can easily become unwieldy to manage. There are a number of frameworks, libraries and APIs available to make this process more manageable and many employers are looking for specific skills in using these packages.

## What will I Learn?

You will learn how design patterns assist in developing a manageable codebase. You’ll then explore how frameworks can decrease the time required developing an application and provide a number of utilities for you to use. Finally, you’ll implement third-party APIs that provide valuable data sets that can improve the quality of your application.

## How does this help my Career?

Interacting with API servers is the primary function of Front-End Web Developers
Use of third-party libraries and APIs is a standard and acceptable practice that is encouraged

## Contribute

- Issue Tracker: https://github.com/shui91/frontend-nanodegree-map-webapp/issues
- Source Code: https://github.com/shui91/frontend-nanodegree-map-webapp/