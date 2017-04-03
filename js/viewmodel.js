/**
 * Created by igorgrabarski on 2017-04-01.
 * @description Main ViewModel function. Define your locations here.
 */
function AppViewModel() {
    var self = this;

    // Active item id
    self.activeItem = ko.observable(0);

    // Text in the filter textbox
    self.filterText = ko.observable('');

    // Message shown to the client
    self.attrMessage = ko.observable("This website uses data from " +
        "<a href='https://en.wikipedia.org'>Wikipedia</a> and " +
        "<a href='https://google.com'> Google</a>.");


    <!-- **************************** List of locations *******************************-->
    self.places = ko.observableArray([{
        name: "Hiroshima Peace Memorial",
        position: {
            lat: 34.395483,
            lng: 132.453592
        }
    }, {
        name: "Okinawa Churaumi Aquarium",
        position: {
            lat: 26.694158,
            lng: 127.877932
        }
    }, {
        name: "Mount Fuji",
        position: {
            lat: 35.360555,
            lng: 138.727778
        }
    }, {
        name: "Hirosaki",
        position: {
            lat: 40.603124,
            lng: 140.463922
        }
    }, {
        name: "Tokyo Tower",
        position: {
            lat: 35.658580,
            lng: 139.745433
        }
    }, {
        name: "Fushimi Inari-taisha",
        position: {
            lat: 34.967140,
            lng: 135.772672
        }
    }, {
        name: "Himeji Castle",
        position: {
            lat: 34.839449,
            lng: 134.693905
        }
    }, {
        name: "Kiyomizu-dera",
        position: {
            lat: 34.994856,
            lng: 135.785046
        }
    }, {
        name: "Jigokudani Monkey Park",
        position: {
            lat: 36.732655,
            lng: 138.462145
        }
    }, {
        name: "Sensōji",
        position: {
            lat: 35.714765,
            lng: 139.796655
        }
    }, {
        name: "Dotonbori",
        position: {
            lat: 34.668723,
            lng: 135.501295
        }
    }, {
        name: "Tsukiji Fish Market",
        position: {
            lat: 35.665486,
            lng: 139.770667
        }
    }, {
        name: "Tokyo Skytree",
        position: {
            lat: 35.710063,
            lng: 139.810700
        }
    }, {
        name: "Tokyo Disneyland",
        position: {
            lat: 35.632896,
            lng: 139.880394
        }
    }, {
        name: "Kabukichō",
        position: {
            lat: 35.694937,
            lng: 139.702861
        }
    }, {
        name: "Ginza",
        position: {
            lat: 35.672114,
            lng: 139.770825
        }
    }, {
        name: "Yasukuni Shrine",
        position: {
            lat: 35.694136,
            lng: 139.743849
        }
    }, {
        name: "Osaka Castle Park",
        position: {
            lat: 34.687315,
            lng: 135.526201
        }
    }, {
        name: "Roppongi",
        position: {
            lat: 35.664122,
            lng: 139.729426
        }
    }, {
        name: "Kubukiza",
        position: {
            lat: 35.669418,
            lng: 139.767737
        }
    }, {
        name: "Universal Studios Japan",
        position: {
            lat: 34.665442,
            lng: 135.432338
        }
    }]);


    <!-- ************* Determines the active item on the list *************-->
    /**
     * @description Determines the active item on the list
     */
    self.setActive = function(itemIndex) {

        self.activeItem(itemIndex);

        for (var k = 0; k < markers.length; k++) {
            if (k === itemIndex) {
                self.createInfoWindow(markers[k], infoWindow);
            }
        }


    }


    <!-- ************* Returns boolean value indicating whether to show the item *************-->
    /**
     * @description Returns boolean value indicating whether to show the item
     * @returns {boolean} Returns true if current location title contains the text of filter textbox
     */
    self.showItem = function(nm) {

        return nm.indexOf(self.filterText()) !== -1;
    }


    <!-- ************* Populates the marker's info window with data *************-->
    /**
     * @description Populates the marker's info window with data
     */
    self.createInfoWindow = function(marker, infowindow) {

        for (var m = 0; m < markers.length; m++) {
            markers[m].setAnimation(null);
        }

        self.activeItem(marker.id);


        if (infowindow.marker !== marker) {
            infowindow.marker = marker;

            marker.setAnimation(google.maps.Animation.BOUNCE);

            var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" +
                marker.title.replace(/ /g, '%20') + "&format=json&callback=wikiCallback";


            <!-- ************* Handles the data accessability issues *************-->
            var wikiRequestTimeout = setTimeout(function() {
                alert("Failed to load data.Please check your connection and reload your page.");
            }, 8000);


            var result = "";
            <!-- ************* Retrieves data from Wikipedia *************-->
            $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                success: function(response) {

                    result = "<h5>" + marker.title + "</h5><hr>";

                    <!-- ************* Url for image in marker's info window ********-->
                    var imageUrl = "https://maps.googleapis.com/maps/api/streetview?" +
                        "size=100x100&location=" + appModel.places()[marker.id].position.lat + "," +
                        appModel.places()[marker.id].position.lng + "&fov=90&heading=235&pitch=10&" +
                        "key=AIzaSyA21z6K4pzpx20TIC249ZWK0VCxGri0DVA";

                    <!-- ************* Url for full article on Wikipedia *************-->
                    var linkUrl = "https://maps.googleapis.com/maps/api/streetview?" +
                        "size=600x600&location=" + appModel.places()[marker.id].position.lat + "," +
                        appModel.places()[marker.id].position.lng + "&fov=90&heading=235&pitch=10&" +
                        "key=AIzaSyA21z6K4pzpx20TIC249ZWK0VCxGri0DVA";

                    <!-- ****** Result code to be inserted into the marker's info window *****-->
                    result += "<a href='" +
                        linkUrl +
                        "'><img class='info-window-image' src='" +
                        imageUrl +
                        "' /></a><p class='info-window-text'>" +
                        response[2][0] +
                        "</p><hr><a href='" +
                        response[3][0] +
                        "' >More info</a>";


                    infowindow.setContent(result);
                    infowindow.open(map, marker);
                    clearTimeout(wikiRequestTimeout);

                    <!-- ******* Hide the marker after click on X icon in info window **********-->
                    infowindow.addListener('closeclick', function() {
                        infowindow.setMarker(null);
                    });


                }
            });

        }
    }

}