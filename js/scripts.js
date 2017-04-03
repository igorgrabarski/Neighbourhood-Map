/**
 * Created by igorgrabarski on 2017-03-28.
 */


/****** Is called when google script could not be loaded. ****/
function googleError() {
    alert("Failed to load the map. Please refresh your page and try again.");
}

var listVisible = true;
var map;
var markers = [];
var infoWindow;
var appModel = new AppViewModel();

appModel.filterText.subscribe(appModel.filterMarkers);

ko.applyBindings(appModel);


/*************************** Google Map and Markers Initialization ***************************/
/**
 * @description Google map and markers initialization
 */
function initMap() {

    if (typeof google !== 'undefined') {
        var uluru = {
            lat: appModel.places()[0].position.lat,
            lng: appModel.places()[0].position.lng
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: uluru,
            styles: [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                }]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                }]
            }, {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                }]
            }, {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            }, {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                }]
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                }]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e'
                }]
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37'
                }]
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c'
                }]
            }, {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948'
                }]
            }, {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                }]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                }]
            }, {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                }]
            }]
        });


        /************* Creates the markers and sets the event listeners *************/
        infoWindow = new google.maps.InfoWindow();

        for (var i = 0; i < appModel.places().length; i++) {

            var marker = new google.maps.Marker({
                position: appModel.places()[i].position,
                title: appModel.places()[i].name,
                animation: google.maps.Animation.DROP,
                map: map,
                id: i
            });

            markers.push(marker);

            marker.addListener('click', function() {
                appModel.createInfoWindow(this, infoWindow);
            });
        }

        /************** By default sets the first location as active  *************/
        appModel.activeItem(0);

    } else {
        googleError();
    }

}