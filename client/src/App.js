import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './App.css';

const BASE_SERVER_URL = "http://localhost:3001"

class App extends Component {

  constructor(props) {
    super(props) 

    this.state = {
      message: "Getting geolocation information..."
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: "Getting restaurant information..."
        }, () => {
          this.fetchRestaurants();
        })
        
      }, error => {
        let message;

        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            message = "The request to get user location timed out."
            break;
          case error.UNKNOWN_ERROR:
            message = "An unknown error occurred."
            break;
          default:
            break;
        }

        this.setState({
          message: message
        })
      });
    } else {
      this.setState({
        message: "Geolocation is not supported by this browser."
      })
    }
  }

  fetchRestaurants = () => {
    axios.get(BASE_SERVER_URL + "/api/restaurants?latitude=" + this.state.latitude + "&longitude=" + this.state.longitude)
    .then(res => {
      this.setState({
        restaurants: res.data,
        message: null
      }, () => {
        this.getNextRestaurant();
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  getNextRestaurant = () => {
    let randomNumber = this.getRandomNumber(this.state.restaurants.length - 1);
    let restaurant = this.state.restaurants[randomNumber];
    this.setState(prevState => ({
      restaurant: {
        name: restaurant.name,
        rating: restaurant.rating,
        location: restaurant.location.address1
      },
      restaurants: prevState.restaurants.filter((_, i) => i !== randomNumber),
      message: null
    }), () => {
      console.log(this.state.restaurants)
    });
  }

  getRandomNumber = (max) => {
    return Math.floor(Math.random() * (max + 1) );
  }

  render() {
    if(this.state.restaurant) {
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
    } else {
      return (
        <div className="App">
          <h2>{this.state.message}</h2>
        </div>
      );
    }
  }
}

export default App;
