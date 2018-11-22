import React from 'react';


class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        lat: "",
        lon: ""
    }
};


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
    var autocomplete;

    this.getGoogleMaps().then((google) => {
       var input = document.getElementById('autocomplete');
        autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', getLocation);
    });

    function getLocation() {
     place = autocomplete.getPlace();
        console.log("loc", place);
    };

    function ipLookUp () {

    var url = 'http://ip-api.com/json';
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            this.setState({
              lat: responseJson.lat,
              lon: responseJson.lon
            });
          })
          .catch((error) => {
           // console.error(error);
            });
    };

function getAddress (latitude, longitude) {
  fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' +latitude + ',' + longitude + '&key=' + 'AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0')
  .then((response) => response.json())
  .then((responseJson) => {
            this.setState({
              lat: responseJson.lat,
              lon: responseJson.lon
            });
  })
  .catch((error) => {
           // console.error(error);
    });
};

if ("geolocation" in navigator) {
  // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
     // for when getting location is a success
         console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);

         getAddress(position.coords.latitude, position.coords.longitude)

   },

        function error(error_message) {
    // for when getting location results in an error
            console.error('An error has occured while retrieving location', error_message)
            ipLookUp();
        });
} else {
  // geolocation is not supported
  // get your location some other way
  console.log('geolocation is not enabled on this browser')
  ipLookUp()
};
}



  render() {

    var barStyle = {
        width: '1000px',
        height: '30px'
    }

    console.log("point", this.state.point);

    return (
      <div className="search">
        <p>Where do you wanna go?</p>
        <form onSubmit={this.props.input} action="/places">
            <input style={barStyle} onChange={this.props.input} ref={el => this.el = el} id="autocomplete" />
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
    );
  }
}

export default Search;