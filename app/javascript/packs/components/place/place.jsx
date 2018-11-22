import React from 'react';

class Place extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      near: "near=Singapore",
      section: "section=topPicks",
      place: {
        location:""
      },
      input:"",
      button: "Choose a Trip",
      trip_id: "",
      able: true
    }
    this.getPlaces = this.getPlaces.bind(this);
    this.locInput = this.locInput.bind(this);
    this.sectionInput = this.sectionInput.bind(this);
    this.sendData = this.sendData.bind(this);
    this.chooseTrip = this.chooseTrip.bind(this);
    this.doneChoosing = this.doneChoosing.bind(this);
  };

locInput(event) {
  this.setState({near: event.target.value});
  this.getPlaces();
}

sectionInput(event) {
  this.setState({section: event.target.value});
  this.getPlaces();
}


sendData() {
  var reactState = this;
  console.log("input", reactState.state.place.location);

   var url = '/places/new';

   fetch(url, {
       method: 'get',
       body: JSON.stringify({
        place: {
          location: reactState.state.place.location
        }
      }),
       headers : {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          }
   })
   .then(function(response){
       return response.json()
   })
   .then(function(data){
       console.log('post req', data);
   })
}


getPlaces() {
  var url = `https://api.foursquare.com/v2/venues/explore/?${this.state.near}&venuePhotos=1&${this.state.section}&client_id=SPIE1GMKQ5LQU2ELRDOY1TLO5YLYKBC31QXH54CAA1ADT4AE&client_secret=G0TD0ADHMNYWEXJ3SWYXUEKHIKWH2OZPS0S2MTOBHS5MNLPS&v=20181113`;

          fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson.response.groups[0].items);
              this.setState({ place: { ...this.state.place, location: responseJson.response.groups[0].items}});
            })
            .catch((error) => {
             // console.error(error);
              });
  };

  chooseTrip(event) {
    var reactState = this;
    console.log("trip", event.target);
    reactState.setState({trip_id: event.target.id});
    reactState.setState({button: event.target.attributes.store.nodeValue});

    var content = document.getElementsByClassName('dropdown-content');
    for (let i=0; i<content.length; i++) {
      content[i].style.display = 'none';
    };

  }

  doneChoosing() {
    var content = document.getElementsByClassName('dropdown-content');
    for (let i=0; i<content.length; i++) {
      content[i].style.display = 'block';
    };
  }

  componentDidMount() {
    var reactState = this;

      function getPlaces() {
    var url = `https://api.foursquare.com/v2/venues/explore/?${reactState.state.near}&venuePhotos=1&${reactState.state.section}&client_id=ZXBTIXJSKMP3JERUZMCLJOC5MTTJIYTSJI2XZ3IG4F3WISSE&client_secret=GPAN3ZXU51UEWKQ3GC2OJG22BJUSMPOXS3YW4VWKLDNYZQNP&v=20181113`;

            fetch(url)
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson.response.groups[0].items);
                reactState.setState({ place: { ...reactState.state.place, location: responseJson.response.groups[0].items} });
                // reactState.setState({places: responseJson.response.groups[0].items});
              })
              .catch((error) => {
               // console.error(error);
                });
  };

  getPlaces();
  }

  render() {
    let squarePl;
    let dropDown;
    let addItinerary;

    var reactState = this;


    if (this.props.allTrips) {
      dropDown = this.props.allTrips.map((trip, index) => {
          return (
                  <div key={index} className="dropdown-content">
                    <p key={index} id={trip.id} store={trip.title} onClick={(e)=>this.chooseTrip(e)} >{trip.title}</p>
                  </div>)
      })
    };


    if(this.state.place.location) {
      squarePl = this.state.place.location.map((item, index) => {
          if (reactState.state.trip_id !== "") {
          addItinerary = (
              <button key={index}><a key={index} href={"/trips/"+reactState.state.trip_id+"/places?location="+item.venue.name}>Add to Itinerary</a></button>
            )
          }
          return(
                <li key={index} className="location-list" key={index} onClick={(e) => this.props.currentfs(e)} id={index} lat={item.venue.location.lat} lon={item.venue.location.lng} all={item.venue} >{item.venue.name}<br />
              {item.venue.location.address}
                {addItinerary}
              </li>
          )
      });

      // console.log("trips", this.props.allTrips);
  }
    return (
        <div className="place">
          <h3>Places of Interest</h3>
          <select id="near" onChange={this.locInput} value={this.state.near}>
              <option value="">Choose a location</option>
              <option value={"ll="+this.props.current[0]+","+this.props.current[1]}>Your current location</option>
              <option value={"ll="+this.props.foursquare[1]+","+this.props.foursquare[2]}>{this.props.foursquare[0]}</option>
          </select>
          <select id="section" onChange={this.sectionInput} value={this.state.section}>
              <option value="section=topPicks">Choose a category</option>
              <option value="section=food">Food</option>
              <option value="section=outdoors">Outdoors</option>
              <option value="section=drinks">Drinks</option>
          </select>

          <div className="dropdown">
            <button onClick={this.doneChoosing} className="dropbtn">{reactState.state.button}
              <i className="fa fa-caret-down"></i>
            </button>
            {dropDown}
          </div>
          <ul className="ul-places">{squarePl}</ul>
        </div>
    );
  }
}

export default Place;