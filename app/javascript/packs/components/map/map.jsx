import React from 'react';

const reactState = this;

const initialState = {
    lat: 1.3521,
    lng: 103.8198,
    place: "",
    fslat: "",
    fslng:""
};

var autocomplete;
var service;
var infowindow;
var map;


class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {...initialState};
    this.changeHandler = this.changeHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
 };

// **********************
// HANDLERS
// **********************
    changeHandler() {
        console.log("sb change", this.sb.value);
    }

    clickHandler() {
        console.log("sb click", this.sb.value);
        // this.setState({query: e.target.value});
    }


// **********************
// GOOGLE MAPS
// **********************
    getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&libraries=places&callback=resolveGoogleMapsPromise`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }


componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map
    var reactState = this;


// **********************
// Setting up the map
// **********************
this.getGoogleMaps().then((google) => {

    var singapore = {lat: reactState.state.lat , lng: reactState.state.lng};
    map = new google.maps.Map(document.getElementById('map'), {
          center: singapore,
          zoom: 15
        });

    infowindow = new google.maps.InfoWindow();

if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {

            reactState.setState({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });

            getServices();

            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

             reactState.props.here(position);

            infowindow.setPosition(pos);
            infowindow.setContent('Your current location!');
            setTimeout(function(){ infowindow.close(); }, 2000);
            infowindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infowindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infowindow, map.getCenter());
        }

      function handleLocationError(browserHasGeolocation, infowindow, pos) {
        infowindow.setPosition(pos);
        infowindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infowindow.open(map);
        ipLookUp();
      }

        var bounds = new google.maps.LatLngBounds();
        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-33.8902, 151.1759),
          new google.maps.LatLng(-33.8474, 151.2631));

        var input = document.getElementById('autocomplete');
        var options = {
          bounds: defaultBounds,
          types: ['establishment']
        };

        autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', getLocation);

    function getLocation() {

        var place = autocomplete.getPlace();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();

        reactState.setState({lat: latitude});
        reactState.setState({lng: longitude});

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setZoom(15);
            getServices();
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);  // Why 17? Because it looks good.
            getServices();
          }


          var address = '';
              if (place.address_components) {
                address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                  (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
          }

    };


// **********************
// G-PLACES SERVICES
// **********************
function getServices() {
    var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: {lat: reactState.state.lat , lng: reactState.state.lng},
              radius: 1000,
              type: ['food', 'place_of_worship', 'establishment']
            }, callback);
};

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP
        });

        marker.setMap(map);
        google.maps.event.addListener(marker, 'click', function() {


          infowindow.setContent(place.name);
          // console.log(place.geometry.location.lat());
          infowindow.open(map, this);
          reactState.props.name(place);
          marker.setAnimation(google.maps.Animation.BOUNCE)
           setTimeout(function(){ marker.setAnimation(null); }, 1500);
            map.setCenter(marker.getPosition());
            map.panTo(map.center);
        });
      }


// **********************
// GEOCODING
// **********************
function ipLookUp () {

        var url = 'http://ip-api.com/json';
            fetch(url)
              .then((response) => response.json())
              .then((responseJson) => {
        reactState.setState({lat: responseJson.lat});
        reactState.setState({lng: responseJson.lng});
                getServices();
              })
              .catch((error) => {
               // console.error(error);
                });
    };

});

}

    componentWillReceiveProps(nextProps) {
        var reactState = this;
  // You don't have to do this check first, but it can help prevent an unneeded render
      if (nextProps.clicked[0] !==  undefined) {
        console.log("HELLO!");

        var pos = {
              lat: this.state.lat,
              lng: this.state.lng
            };

        reactState.setState({lat: nextProps.clicked[0], lng:nextProps.clicked[1]});
        var latLng = new google.maps.LatLng(this.state.lat, this.state.lng);
        map.panTo(latLng);
        infowindow.setPosition(latLng);
        map.setCenter(latLng);

            var marker = new google.maps.Marker({
              map: map,
              position: latLng,
              animation: google.maps.Animation.DROP,
              icon: {
                url: './assets/marker.png',
                scaledSize: new google.maps.Size(70, 70)
                }
        });

        google.maps.event.addListener(marker, 'click', function() {

          // console.log(place.geometry.location.lat());
          infowindow.open(map);
          reactState.props.name(place);
          marker.setAnimation(google.maps.Animation.BOUNCE)
           setTimeout(function(){ marker.setAnimation(null); }, 1500);
            map.setCenter(marker.getPosition());
            map.panTo(map.center);
        });
         }
};


  render() {
    console.log("clickyyyyy", this.props.clicked[0]);
    console.log(this.state.lat);
    console.log(this.state.lng);
    var barStyle = {
        width: '700px',
        height: '30px'
    }

    var divStyle = {
        height: '500px',
        width: '700px'
    }

    return (
        <div className="main">
        <div className="search">
        <h3>Search for a location</h3>
        <form onClick={this.clickHandler} className="search-results" >
            <input className="name" style={barStyle} ref={sb => this.sb = sb} onClick={this.changeHandler} id="autocomplete"/>
        </form>
        <div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">I want to see..
            <span className="caret"></span></button>
            <ul className="dropdown-menu">
                <li><button value="food">Name</button></li>
                <li><button value="poi">Popularity</button></li>
                <li><button value="hotels">Customer Ratings</button></li>
            </ul>
        </div>
      </div>

            <div style={divStyle} id="map"></div>
        </div>
    );
  }
}

export default Main;