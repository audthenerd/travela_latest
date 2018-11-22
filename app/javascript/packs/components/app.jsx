import React from 'react';
import {Switch, Route} from 'react-router-dom'

import Search from './search/search'
import Main from './map/map'
import Place from './place/place'
import Detail from './detail/detail'

export default class App extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            query: 'hello',
            name: "",
            current: "",
            currentfs: "",
            venue: ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.placeSearched = this.placeSearched.bind(this);
        this.getCurrentLoc = this.getCurrentLoc.bind(this);
        this.getName = this.getName.bind(this);
        this.getPoints = this.getPoints.bind(this);
    };



    changeHandler(e) {
        console.log('changeHandler', e.target);
    }

    placeSearched(event) {
        console.log(event.target);
    }

    getCurrentLoc(position) {
        this.setState({current: [position.coords.latitude, position.coords.longitude]});
        console.log("current", this.state.current);
    }

    getName(place) {
        this.setState({name: [place.name, place.geometry.location.lat(), place.geometry.location.lng()]});
        console.log(this.state.name);
    }

    getPoints(event){
        this.setState({
            currentfs: [event.target.attributes.lat.nodeValue, event.target.attributes.lon.nodeValue],
            venue: event.target.attributes.all.nodeValue
        });
        console.log("currentfs", this.state.currentfs);
        console.log("current venue", this.state.venue);
    }


  render(){

    var compStyle = {
        display: 'flex',
    }
    return(
        <div>
            <Switch>
                <Route exact path="/" render={(props) => <Search {...props} input={this.changeHandler} search={this.placeSearched} val={this.state.query} />}  />
                <Route path="/trips" render={(props) =>
                    <div style={compStyle} >
                     <Main here={this.getCurrentLoc} name={this.getName}{...props} clicked={this.state.currentfs} />
                    <Place current={this.state.current} foursquare={this.state.name}{...props} currentfs={this.getPoints} allTrips={this.props.trips} />
                    <Detail clicked={this.state.venue}{...props} />
                    </div>
                } />
            </Switch>
        </div>);
  }
}