import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './App.css';

const BASE_SERVER_URL = "http://localhost:3001"

class App extends Component {

  constructor(props) {
    super(props) 

    this.state = {
      latitude: null,
      longitude: null,
      restaurant: null
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, () => {
        this.getNextRestaurant();
      })
    });
  }

  getNextRestaurant = () => {
    axios.get(BASE_SERVER_URL + "/api/restaurants?latitude=" + this.state.latitude + "&longitude=" + this.state.longitude)
    .then(res => {
      let restaurant = res.data[0];

      this.setState({
        restaurant: {
          name: restaurant.name,
          rating: restaurant.rating,
          location: restaurant.location.address1
        }
      }) 
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    if(this.state.restaurant && this.state.latitude && this.state.longitude) {
      return (
        <div className="App">
          <h2>{this.state.restaurant.name}</h2>
          <h2>{this.state.restaurant.rating}</h2>
          <h2>{this.state.restaurant.location}</h2>
          <Button onClick={this.getNextRestaurant} variant="contained" color="primary">
            Shuffle
          </Button>
        </div>
      );
    } else if (!this.state.latitude && !this.state.longitude) {
      return (
        <div className="App">
          <h2>Waiting for geolocation information...</h2>
        </div>
      );
    } else if (!this.state.restaurant) {
      return (
        <div className="App">
          <h2>Getting new restaurant...</h2>
        </div>
      );
    }
  }
}

export default App;
