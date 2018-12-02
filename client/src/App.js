import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './App.css';

const BASE_SERVER_URL = "http://localhost:3001"

class App extends Component {

  constructor(props) {
    super(props) 

    this.state = {
      latitude: 43.847950,
      longitude: -79.346095,
      restaurant: {
        name: "Nando's",
        rating: 4,
        location: "123 Fake Street"
      }
    }
  }

  shuffle = () => {
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
    return (
      <div className="App">
        <h2>{this.state.restaurant.name}</h2>
        <h2>{this.state.restaurant.rating}</h2>
        <h2>{this.state.restaurant.location}</h2>
        <Button onClick={this.shuffle} variant="contained" color="primary">
          Shuffle
        </Button>
      </div>
    );
  }
}

export default App;
